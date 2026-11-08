"use client";

import { useEffect, useState } from "react";
import { ColumnWithTasks } from "@/features/column/types/types";
import ColumnForm from "@/features/column/components/ColumnForm";
import ColumnItem from "@/features/column/components/ColumnItem";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { updateColumnOrder } from "@/features/column/actions/updateColumnOrder";
import { toast } from "sonner";
import { updateTaskOrder } from "@/features/task/actions/updateTaskOrder";

type Props = {
  projectId: string;
  data: ColumnWithTasks[];
};

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function ColumnContainer({ projectId, data }: Props) {
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  async function onDragEnd(result: DropResult) {
    const { destination, source, type } = result;
    if (!destination) {
      return;
    }

    //if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // User moves a column

    if (type === "column") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index }),
      );
      setOrderedData(items);
      const res = await updateColumnOrder({ items, projectId });
      if (!res.success) {
        setOrderedData(data);
        toast.error(res.message);
      }
    }

    if (type === "task") {
      const newOrderedData = orderedData.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) => ({ ...task })),
      }));

      //source and destination column
      const sourceColumn = newOrderedData.find(
        (column) => column.id === source.droppableId,
      );
      const destinationColumn = newOrderedData.find(
        (column) => column.id === destination.droppableId,
      );

      if (!sourceColumn || !destinationColumn) {
        return;
      }

      //check if tasks exisits on sourceColumn
      if (!sourceColumn.tasks) {
        sourceColumn.tasks = [];
      }

      //check if tasks exisits on destinationColumn
      if (!destinationColumn.tasks) {
        destinationColumn.tasks = [];
      }

      //Moving the tasks in the same column

      if (source.droppableId === destination.droppableId) {
        const reorderedTasks = reorder(
          sourceColumn.tasks,
          source.index,
          destination.index,
        );

        reorderedTasks.forEach((task, index) => {
          task.order = index;
        });

        sourceColumn.tasks = reorderedTasks;
        setOrderedData(newOrderedData);
        const res = await updateTaskOrder({ items: reorderedTasks, projectId });
        if (!res.success) {
          setOrderedData(data);
          toast.error(res.message);
        }
        //user moves task to another column
      } else {
        // remove task from the source column
        const [movedTask] = sourceColumn.tasks.splice(source.index, 1);

        //Asign the new columnId to the moved task
        movedTask.columnId = destination.droppableId;

        // Add the task to the detionation column
        destinationColumn.tasks.splice(destination.index, 0, movedTask);

        // update the order for each task in the source column
        sourceColumn.tasks.forEach((task, index) => {
          task.order = index;
        });

        // update the order for each task in the destination column
        destinationColumn.tasks.forEach((task, index) => {
          task.order = index;
        });

        setOrderedData(newOrderedData);
        const allUpdatedTasks = [
          ...sourceColumn.tasks,
          ...destinationColumn.tasks,
        ];
        const res = await updateTaskOrder({
          items: allUpdatedTasks,
          projectId,
        });
        if (!res.success) {
          setOrderedData(data);
          toast.error(res.message);
        }
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="column" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((column, index) => {
              return <ColumnItem key={column.id} index={index} data={column} />;
            })}
            {provided.placeholder}
            <ColumnForm />
            <div className="shrink-0 w-1"></div>
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default ColumnContainer;
