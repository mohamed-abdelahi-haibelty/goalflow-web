import { getTaskTimer } from "@/features/pomodoro/actions/timer";
import PomodoroTimer from "@/features/pomodoro/components/PomodoroTimer";
import { getTaskById } from "@/features/task/actions/getTaskById";

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
