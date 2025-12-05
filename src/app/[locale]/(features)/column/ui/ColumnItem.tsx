"use client";

import { ColumnWithTasks } from "../types/types";
import ColumnHeader from "./ColumnHeader";

type Props = {
  data: ColumnWithTasks;
  index: number;
};

function ColumnItem({ data, index }: Props) {
  return (
    <li className="h-full w-[272px] shrink-0 select-none">
      <div className="w-full rounded-md bg-card/80  pb-2">
        <ColumnHeader data={data} />
      </div>
    </li>
  );
}

export default ColumnItem;
