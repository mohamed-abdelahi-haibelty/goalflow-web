"use client";

import { useState } from "react";
import { ColumnWithTasks } from "../types/types";
import ColumnHeader from "./ColumnHeader";
import TaskForm from "../../task/ui/TaskForm";
import { useForm } from "react-hook-form";
import { CreateTaskInput, createTaskSchema } from "../../task/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import TaskItem from "../../task/ui/TaskItem";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

type Props = {
  data: ColumnWithTasks;
  index: number;
};

function ColumnItem({ data, index }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
    },
  });

  function enableEditing() {
    setIsEditing(true);
    form.setValue("columnId", data.id);
    form.setValue("projectId", data.projectId);
    setTimeout(() => {
      form.setFocus("title");
    });
  }

  function disableEditing() {
    setIsEditing(false);
    form.reset();
  }

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="h-full w-[272px] shrink-0 select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-card/80 pb-2"
          >
            <ColumnHeader data={data} onAddTask={enableEditing} />
            <Droppable droppableId={data.id} type="task">
              {(provided) => (
                <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                    data.tasks.length > 0 ? "mt-2" : "mt-0"
                  )}
                >
                  {data.tasks.map((task, index) => (
                    <TaskItem index={index} key={task.id} data={task} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <TaskForm
              columnId={data.id}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
              form={form}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
}

export default ColumnItem;
