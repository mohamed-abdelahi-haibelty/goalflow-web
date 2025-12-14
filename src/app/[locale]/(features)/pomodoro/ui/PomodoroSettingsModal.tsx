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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTransition } from "react";
import { updateGlobalSettings } from "../action/settings";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { TimerSettings } from "@/generated/prisma/client";
import { useRouter } from "@/i18n/navigation";

const settingsSchema = z.object({
  work: z
    .number()
    .min(1, "Work duration must be at least 1 minute")
    .max(60, "Work duration cannot exceed 60 minutes"),
  short: z
    .number()
    .min(1, "Short break must be at least 1 minute")
    .max(30, "Short break cannot exceed 30 minutes"),
  long: z
    .number()
    .min(1, "Long break must be at least 1 minute")
    .max(60, "Long break cannot exceed 60 minutes"),
  rounds: z
    .number()
    .min(1, "Rounds must be at least 1")
    .max(10, "Rounds cannot exceed 10"),
  volume: z.number().min(0).max(100),
});

type SettingsInput = z.infer<typeof settingsSchema>;

interface PomodoroSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: TimerSettings;
}

function PomodoroSettingsModal({
  isOpen,
  onClose,
  currentSettings,
}: PomodoroSettingsModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      work: Math.floor(currentSettings.workDuration / 60),
      short: Math.floor(currentSettings.shortBreakDur / 60),
      long: Math.floor(currentSettings.longBreakDur / 60),
      rounds: currentSettings.roundsBeforeLongBreak,
      volume: currentSettings.soundVolume,
    },
  });

  const onSubmit = (values: SettingsInput) => {
    startTransition(async () => {
      try {
        await updateGlobalSettings({
          work: values.work * 60,
          short: values.short * 60,
          long: values.long * 60,
          rounds: values.rounds,
          volume: values.volume,
        });

        toast.success("Settings updated successfully!");
        router.refresh();
        onClose();
      } catch (error) {
        toast.error("Failed to update settings. Please try again.");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 grid grid-cols-2 gap-x-3"
          >
            {/* Work Duration */}
            <FormField
              name="work"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="25"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Short Break Duration */}
            <FormField
              name="short"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Break (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Long Break Duration */}
            <FormField
              name="long"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Break (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="15"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rounds Before Long Break */}
            <FormField
              name="rounds"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rounds before long break</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="4"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Volume Slider */}
            <FormField
              name="volume"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sound Volume: {field.value}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[field.value ?? 0]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <div className="flex items-center gap-1">
                    <span>Saving…</span>
                    <Spinner />
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default PomodoroSettingsModal;
