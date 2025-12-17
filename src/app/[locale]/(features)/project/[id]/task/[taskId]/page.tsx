import { getTaskTimer } from "@/app/[locale]/(features)/pomodoro/action/timer";
import PomodoroTimer from "@/app/[locale]/(features)/pomodoro/ui/PomodoroTimer";
import { getTaskById } from "@/app/[locale]/(features)/task/action/getTaskById";

type Props = {
  params: Promise<{ id: string; taskId: string }>;
};

async function page({ params }: Props) {
  const { id: projectId, taskId } = await params;
  const { timer, settings } = await getTaskTimer(taskId);
  const { data: task } = await getTaskById({ taskId, projectId });
  return (
    <PomodoroTimer
      initialTimer={timer}
      initialSettings={settings!}
      task={task!}
      projectId={projectId}
    />
  );
}

export default page;
