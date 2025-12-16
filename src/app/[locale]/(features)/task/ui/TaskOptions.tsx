"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Task } from "@/generated/prisma/client";
import { PopoverClose } from "@radix-ui/react-popover";

import { MoreHorizontal, X } from "lucide-react";
import { useState, useTransition } from "react";

import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { deleteTask } from "../action/deleteTask";
import RenameTaskModal from "./RenameTaskModal";
import { useTranslations } from "next-intl";

type Props = {
  task: Task;
  projectId: string;
};

function TaskOptions({ task, projectId }: Props) {
  const t = useTranslations("taskOptions");
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const onDeleteTask = () => {
    const values = { id: task.id, projectId: projectId };
    startTransition(async () => {
      const res = await deleteTask(values);

      if (!res) {
        toast.error(t("toast.genericError"));
        return;
      }

      if (res.success) {
        toast.success(t("toast.deleteSuccess"));
      } else {
        if (res.message) {
          toast.error(res.message || t("toast.deleteFailed"));
        }
      }
    });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="h-auto w-auto p-1" variant={"ghost"}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="px-0 pt-3 pb-3  w-44"
          side="bottom"
          align="start"
        >
          <div className="text-sm font-medium text-center text-neutral-600 pb-4">
            {t("title")}
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
            onClick={() => setIsOpen(true)}
            className="rounded-none w-full h-auto p-2 px-5 font-normal justify-start text-sm"
            variant={"ghost"}
          >
            {t("rename")}
          </Button>

          <Button
            onClick={onDeleteTask}
            className="rounded-none w-full h-auto p-2 px-5 font-normal justify-start text-sm"
            variant={"ghost"}
          >
            {isPending ? (
              <div className="flex gap-1 items-center">
                <span>{t("deleting")}</span>
                <Spinner className="w-4 h-4" />
              </div>
            ) : (
              t("delete")
            )}
          </Button>
        </PopoverContent>
      </Popover>

      <RenameTaskModal
        key={task.id + task.title}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        projectId={projectId}
        task={task}
      />
    </>
  );
}

export default TaskOptions;
