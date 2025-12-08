"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Column } from "@/generated/prisma/client";
import { ComponentRef, useRef, useState, useTransition } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { UpdateColumnInput, updateColumnSchema } from "../types/types";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateColumn } from "../action/updateColumn";
import ColumnOptions from "./ColumnOptions";

type Props = {
  data: Column;
  onAddTask: () => void;
};

function ColumnHeader({ data, onAddTask }: Props) {
  const [title, setTitle] = useState(data.name);
  const formRef = useRef<ComponentRef<"form">>(null);
  const params = useParams();
  const [_, startTransition] = useTransition();

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<UpdateColumnInput>({
    resolver: zodResolver(updateColumnSchema),
    defaultValues: {
      name: "",
    },
  });

  function enableEditing() {
    setIsEditing(true);
    form.setValue("projectId", params.id as string);
    form.setValue("id", data.id as string);
    setTimeout(() => {
      form.setFocus("name");
    });
  }

  function disableEditing() {
    setIsEditing(false);
    form.reset();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      disableEditing();
      form.reset();
    }
  }

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);

  const onSubmit = (values: UpdateColumnInput) => {
    const prevTitle = title;

    // ⭐ Optimistic UI update
    setTitle(values.name);

    startTransition(async () => {
      const res = await updateColumn(values);

      if (!res) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      if (res.success) {
        toast.success(`Renamed To ${res.data?.name}`);
        setTitle(res.data?.name!);
        disableEditing();
        form.reset();
      } else {
        setTitle(prevTitle);
        toast.error("Rename failed");
        if (res.message) {
          toast.error(res.message);
        }

        if (res.error) {
          Object.entries(res.error).forEach(([key, value]) => {
            if (key in values) {
              form.setError(key as keyof UpdateColumnInput, {
                type: "server",
                message: value?.[0],
              });
            }
          });
          toast.error("Please check the form for errors.");
        }
      }
    });
  };

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 px-0.5"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="text-sm px-2 py-1 h-7 font-medium border-transparent shadow-none hover:border-input focus:border-input transition"
                      placeholder="Rename Column..."
                      {...field}
                      onBlur={() => form.handleSubmit(onSubmit)()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button type="submit" hidden />
          </form>
        </Form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm  px-2.5 py-1 h-7 font-medium border-transparent"
        >
          {title}
        </div>
      )}
      <ColumnOptions column={data} onAddTask={onAddTask} />
    </div>
  );
}

export default ColumnHeader;
