"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { useTransition } from "react";

import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@/i18n/navigation";
import { RenameTaskInput, renameTaskSchema } from "../types/types";
import { renameTask } from "../action/renameTask";
import { Task } from "@/generated/prisma/client";
import { useTranslations } from "next-intl";

interface RenameTaskProps {
  isOpen: boolean;
  task: Task;
  projectId: string;
  onClose: () => void;
}

function RenameTaskModal({
  isOpen,
  onClose,
  task,
  projectId,
}: RenameTaskProps) {
  const t = useTranslations("renameTaskModal");
  const [isPending, startTransition] = useTransition();
  const form = useForm<RenameTaskInput>({
    resolver: zodResolver(renameTaskSchema),
    defaultValues: {
      title: task.title,
      id: task.id,
      projectId: projectId,
    },
  });
  const router = useRouter();

  const onSubmit = (values: RenameTaskInput) => {
    startTransition(async () => {
      const res = await renameTask(values);

      if (!res) {
        toast.error(t("toast.genericError"));
        return;
      }

      if (res.success) {
        toast.success(t("toast.renameSuccess"));
        form.reset();
        router.refresh();
        onClose();
        router.push(`/project/${projectId}`);
      } else {
        if (res.message) {
          toast.error(res.message);
        }

        if (res.error) {
          Object.entries(res.error).forEach(([key, value]) => {
            if (key in values) {
              form.setError(key as keyof RenameTaskInput, {
                type: "server",
                message: value?.[0],
              });
            }
          });
          toast.error(t("toast.formError"));
        }
      }
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder={t("placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-3">
              <DialogClose type="button" asChild>
                <Button variant="outline">{t("cancel")}</Button>
              </DialogClose>

              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <div className="flex items-center gap-1">
                    <span>{t("saving")}</span>
                    <Spinner />
                  </div>
                ) : (
                  t("save")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default RenameTaskModal;
