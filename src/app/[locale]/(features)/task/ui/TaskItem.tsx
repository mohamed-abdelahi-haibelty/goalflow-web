import { useState } from "react";
import { Task } from "@/generated/prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import TaskOptions from "./TaskOptions";
import { Link } from "@/i18n/navigation";
import { ToggleTaskCompleted } from "../action/toggleTaskCompleted";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  data: Task;
  index: number;
  projectId: string;
};

function TaskItem({ data, index, projectId }: Props) {
  const [completed, setCompleted] = useState<boolean>(data.completed);

  const toggleCompleted = async (isCompleted: boolean) => {
    setCompleted(isCompleted); // optimistic UI
    const res = await ToggleTaskCompleted({
      projectId,
      id: data.id,
      completed: isCompleted,
    });

    if (res.success) {
      toast.success(res.message);
      return;
    }

    // revert on error
    setCompleted(!isCompleted);
    toast.error(res.message);
  };

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
          role="button"
          className="group cursor-pointer flex items-center gap-x-2 justify-between border border-transparent hover:border-black py-2 px-3 text-sm bg-background rounded-md"
        >
          <div className="flex items-center min-w-0">
            {/* stop propagation to avoid starting drag when clicking */}
            <Checkbox
              checked={completed}
              onCheckedChange={(checked) => toggleCompleted(Boolean(checked))}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
              className="opacity-100  mr-2 shrink-0 dark:border-primary/70"
            />
            <Link
              href={`/project/${projectId}/task/${data.id}`}
              className={`truncate ${
                completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              <span>{data.title}</span>
            </Link>
          </div>
          <span>
            <TaskOptions task={data} projectId={projectId} />
          </span>
        </div>
      )}
    </Draggable>
  );
}

export default TaskItem;
