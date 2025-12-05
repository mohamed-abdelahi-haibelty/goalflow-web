"use client";

import { useEffect, useState } from "react";
import { ColumnWithTasks } from "../types/types";
import ColumnForm from "./ColumnForm";
import ColumnItem from "./ColumnItem";

type Props = {
  projectId: string;
  data: ColumnWithTasks[];
};

function ColumnContainer({ projectId, data }: Props) {
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  return (
    <ol className="flex gap-x-3 h-full">
      {orderedData.map((column, index) => {
        return <ColumnItem key={column.id} index={index} data={column} />;
      })}
      <ColumnForm />
      <div className="shrink-0 w-1"></div>
    </ol>
  );
}

export default ColumnContainer;
