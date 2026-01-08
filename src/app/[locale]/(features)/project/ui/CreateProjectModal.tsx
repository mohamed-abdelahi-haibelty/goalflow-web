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
import { useState, useTransition } from "react";
import { createProject } from "../action/createProject";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { UpgradeModal } from "../../billing/ui/UpgradeModal";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectCount: number;
  isPro: boolean;
  userId: string;
  userEmail: string;
}

function CreateProjectModal({
  isOpen,
  onClose,
  isPro,
  currentProjectCount,
  userEmail,
  userId,
}: CreateProjectModalProps) {
  const t = useTranslations("project.create");
  //const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
    },
  });
  const router = useRouter();

  const onSubmit = (values: CreateProjectInput) => {
    // LOGIC: If free and has 2 or more projects, stop and show upgrade
    // if (!isPro && currentProjectCount >= 2) {
    //   setShowUpgrade(true);
    //   return;
    // }
    startTransition(async () => {
      const res = await createProject(values);

      if (!res) {
        toast.error(t("toast.error"));
        return;
      }

      if (res.success) {
        toast.success(res.message || "Project created successfully!");
        form.reset();
        onClose();
        router.push(`/project/${res?.data?.id}`);
      } else {
        if (res.message) {
          toast.error(t("toast.error"));
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
          toast.error(t("toast.formError"));
        }
      }
    });
  };

  // If upgrade triggered, show that modal instead or on top
  // if (showUpgrade) {
  //   return (
  //     <UpgradeModal
  //       isOpen={true}
  //       onClose={() => {
  //         setShowUpgrade(false);
  //         onClose(); // Close the create modal too
  //       }}
  //       userId={userId}
  //       userEmail={userEmail}
  //     />
  //   );
  // }

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
              name="name"
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
              <DialogClose asChild>
                <Button variant="outline">{t("cancel")}</Button>
              </DialogClose>

              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <div className="flex items-center gap-1">
                    <span>{t("creating")}</span>
                    <Spinner />
                  </div>
                ) : (
                  t("create")
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
