import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useLocale, useTranslations } from "next-intl";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("table.pagination");
  return (
    <div className="flex flex-col gap-3 items-center justify-between px-2 sm:flex-row sm:gap-0">
      <div className="text-muted-foreground flex-1 text-xs sm:text-sm text-center sm:text-start">
        {t("selected", {
          count: table.getFilteredSelectedRowModel().rows.length,
          total: table.getFilteredRowModel().rows.length,
        })}
      </div>
      <div className="flex flex-col sm:flex-row  items-center sm:gap-x-6 lg:gap-x-8 gap-2 sm:gap-0">
        <div className="flex items-center gap-x-2">
          <p className="text-xs sm:text-sm font-medium whitespace-nowrap">
            {t("rowsPerPage")}
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px] bg-card">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-xs sm:text-sm font-medium">
          {t("pageInfo", {
            current: table.getState().pagination.pageIndex + 1,
            total: table.getPageCount(),
          })}
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex bg-card"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("firstPage")}</span>
            {isRtl ? <ChevronsRight /> : <ChevronsLeft />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 bg-card"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("prevPage")}</span>
            {isRtl ? <ChevronRight /> : <ChevronLeft />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 bg-card"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("nextPage")}</span>
            {isRtl ? <ChevronLeft /> : <ChevronRight />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex bg-card"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("lastPage")}</span>
            {isRtl ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
      </div>
    </div>
  );
}
