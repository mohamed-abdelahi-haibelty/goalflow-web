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
import { CreateProjectInput, createProjectSchema } from "../types/project";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { createProject } from "../action/createProject";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "@/i18n/navigation";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
    },
  });
  const router = useRouter();

  const onSubmit = (values: CreateProjectInput) => {
    startTransition(async () => {
      const res = await createProject(values);

      if (!res) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      if (res.success) {
        toast.success(res.message || "Project created successfully!");
        form.reset();
        onClose();
        router.push(`/project/${res?.data?.id}`);
      } else {
        if (res.message) {
          toast.error(res.message);
        }

        if (res.error) {
          Object.entries(res.error).forEach(([key, value]) => {
            if (key in values) {
              form.setError(key as keyof CreateProjectInput, {
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

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Create Project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-3">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <div className="flex items-center gap-1">
                    <span>Creating…</span>
                    <Spinner />
                  </div>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProjectModal;
