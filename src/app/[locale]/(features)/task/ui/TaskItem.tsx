import { Task } from "@/generated/prisma/client";
import { Draggable } from "@hello-pangea/dnd";

type Props = {
  data: Task;
  index: number;
};

function TaskItem({ data, index }: Props) {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
          role="button"
          className="truncate cursor-pointer border border-transparent hover:border-black py-2 px-3 text-sm bg-background rounded-md"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
}

export default TaskItem;
