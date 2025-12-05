"use client";
import React, { ComponentRef, useRef, useState, useTransition } from "react";
import ColumnWrapper from "./ColumnWrapper";
import { Plus, X } from "lucide-react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { CreateColumnInput, createColumnSchema } from "../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { createColumn } from "../action/createColumn";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

function ColumnForm() {
  const formRef = useRef<ComponentRef<"form">>(null);
  const inputRef = useRef<ComponentRef<"input">>(null);
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<CreateColumnInput>({
    resolver: zodResolver(createColumnSchema),
    defaultValues: {
      name: "",
    },
  });

  function enableEditing() {
    setIsEditing(true);
    form.setValue("projectId", params.id as string);
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

  const onSubmit = (values: CreateColumnInput) => {
    console.log("values", values);

    const projectId = values.projectId;
    console.log("projectid", projectId);
    startTransition(async () => {
      const res = await createColumn(values);

      if (!res) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      if (res.success) {
        toast.success(res.message || "Column created successfully!");
        disableEditing();
        form.reset();
      } else {
        if (res.message) {
          toast.error(res.message);
        }

        if (res.error) {
          Object.entries(res.error).forEach(([key, value]) => {
            if (key in values) {
              form.setError(key as keyof CreateColumnInput, {
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

  if (isEditing) {
    return (
      <ColumnWrapper>
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full bg-card p-3 rounded-md space-y4 shadow-md border "
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="text-sm px-2 py-1 h-7 font-medium border-transparent shadow-none hover:border-input focus:border-input transition"
                      placeholder="Enter column name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="projectId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      hidden
                      className="text-sm px-2 py-1 h-7 font-medium border-transparent shadow-none hover:border-input focus:border-input transition"
                      {...field}
                      value={params.id}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-1 mt-4">
              <Button disabled={isPending} className="border">
                {isPending ? (
                  <div className="flex items-center gap-1">
                    <span>Saving…</span>
                    <Spinner />
                  </div>
                ) : (
                  "Add Column"
                )}
              </Button>
              <Button onClick={disableEditing} size={"sm"} variant={"ghost"}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </ColumnWrapper>
    );
  }
  return (
    <ColumnWrapper>
      <button
        onClick={enableEditing}
        className="w-full rounded-md bg-card hover:bg-card/80 transition p-3 flex items-center font-medium text-sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add a Column
      </button>
    </ColumnWrapper>
  );
}

export default ColumnForm;
