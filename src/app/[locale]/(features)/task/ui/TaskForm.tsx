"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { CreateTaskInput} from "../types/types";
import { ComponentRef, KeyboardEventHandler, useRef, useTransition } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { toast } from "sonner";
import { createTask } from "../action/createTask";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";

type Props = {
  form: ReturnType<typeof useForm<CreateTaskInput>>;
  columnId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
};

function TaskForm({
  isEditing,
  enableEditing,
  disableEditing,
  columnId,
  form
}: Props) {
  const t = useTranslations("taskForm");
  const formRef = useRef<ComponentRef<"form">>(null);
  const [isPending, startTransition] = useTransition();

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      disableEditing();
      form.reset();
    }
  }

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);


  const onTextAreaKeydDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
      if(e.key === 'Enter' && !e.shiftKey){
          e.preventDefault()
          //form.handleSubmit(onSubmit)
          formRef.current?.requestSubmit();
      }
  }

  const onSubmit = (values: CreateTaskInput) => {
    startTransition(async () => {
      const res = await createTask(values);

      if (!res) {
        toast.error(t("toast.genericError"));
        return;
      }

      if (res.success) {
        toast.success(res.message);
        disableEditing();
        form.reset();
      } else {
        toast.error(res.message);
        if (res.message) {
          toast.error(t("toast.createFailed"));
          disableEditing();
        }

        if (res.error) {
          Object.entries(res.error).forEach(([key, value]) => {
            if (key in values) {
              form.setError(key as keyof CreateTaskInput, {
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

  if (isEditing) {
    return (
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="m-1 py-0.5 px-1 space-y-4"
        >
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="resize-none focus-visible:ring-0 bg-background focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-none border-none"
                    placeholder={t("placeholder")}
                    {...field}
                    onKeyDown={onTextAreaKeydDown}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-x-1 mt-2">
            <Button type="submit">
                {isPending ? <>
                <span>{t("adding")}</span>
                <Spinner className="w-4 h-4"/>
                </> :  t("addTask")}
            </Button>
            <Button onClick={disableEditing} size={"sm"} variant={"ghost"}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </Form>
    );
  }
  return (
    <div className="pt-2 px-2">
      <Button
        onClick={enableEditing}
        size={"sm"}
        variant={"ghost"}
        className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground/70 text-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t("addTask")}
      </Button>
    </div>
  );
}

export default TaskForm;
