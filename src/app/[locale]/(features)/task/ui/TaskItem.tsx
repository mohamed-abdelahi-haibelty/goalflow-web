import { Task } from "@/generated/prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import TaskOptions from "./TaskOptions";
import { Link } from "@/i18n/navigation";

type Props = {
  data: Task;
  index: number;
  projectId: string;
};

function TaskItem({ data, index, projectId }: Props) {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <Link href={`/project/${projectId}/task/${data.id}`}>
          <div
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
            role="button"
            className="cursor-pointer flex items-center gap-x-1 justify-between border border-transparent hover:border-black py-2 px-3 text-sm bg-background rounded-md"
          >
            <span className="truncate ">{data.title}</span>
            <span className="">
              <TaskOptions task={data} projectId={projectId} />
            </span>
          </div>
        </Link>
      )}
    </Draggable>
  );
}

export default TaskItem;
