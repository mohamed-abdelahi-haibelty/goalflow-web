"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Column } from "@/generated/prisma/client";
import { PopoverClose } from "@radix-ui/react-popover";

import { MoreHorizontal, X } from "lucide-react";
import { useTransition } from "react";
import { deleteColumn } from "../action/deleteColumn";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  column: Column;
  onAddTask: () => void;
};

function ColumnOptions({ column, onAddTask }: Props) {
  const [isPending, startTransition] = useTransition();

  const onDeleteColumn = () => {
    const values = { id: column.id, projectId: column.projectId };
    startTransition(async () => {
      const res = await deleteColumn(values);

      if (!res) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      if (res.success) {
        toast.success(res.message);
      } else {
        if (res.message) {
          toast.error(res.message);
        }
      }
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-1" variant={"ghost"}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="px-0 pt-3 pb-3  w-60"
        side="bottom"
        align="start"
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Column Actions
        </div>
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-1 absolute top-2 right-2 text-neutral-600"
            variant={"ghost"}
          >
            <X className="h-4 w-4 " />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddTask}
          className="rounded-none w-full h-auto p-2 px-5 font-normal justify-start text-sm"
          variant={"ghost"}
        >
          {" "}
          Add Task...
        </Button>

        <Button
          onClick={onDeleteColumn}
          className="rounded-none w-full h-auto p-2 px-5 font-normal justify-start text-sm"
          variant={"ghost"}
        >
          {isPending ? (
            <div className="flex gap-1 items-center">
              <span>Deleting...</span>
              <Spinner className="w-4 h-4" />
            </div>
          ) : (
            "Delete Column"
          )}
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default ColumnOptions;
