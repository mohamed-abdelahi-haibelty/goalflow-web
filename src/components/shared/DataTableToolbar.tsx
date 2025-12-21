"use client";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { getTableSearchValue, handleTableSearch } from "@/lib/utils";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  /** which columns should receive the search string (e.g. ["name","email","phone"]) */
  searchColumns?: string[];
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Faceted filters (status, role, ...) */
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  /**
   * deleteAction must accept an array of ids and return Promise<{message: string}>
   * e.g. async (ids) => api.deleteMany(ids)
   */
  deleteAction?: (ids: string[]) => Promise<{ message: string }>;
  /** Optional labels for the confirmation dialog */
  deleteConfirmTitle?: string;
  deleteConfirmDescription?: string;
  deleteConfirmLabel?: string;
  deleteCancelLabel?: string;
}

export function DataTableToolbar<TData>({
  table,
  filters,
  searchColumns = ["title"],
  searchPlaceholder = "Search...",
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const currentSearchValue = getTableSearchValue(table, searchColumns);

  const onSearchChange = (value: string) => {
    handleTableSearch(table, searchColumns, value);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={currentSearchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px] bg-card"
        />
        {filters?.map(
          (filter) =>
            table.getColumn(filter.columnId) && (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={table.getColumn(filter.columnId)}
                title={filter.title}
                options={filter.options}
              />
            )
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X />
          </Button>
        )}
      </div>
    </div>
  );
}
