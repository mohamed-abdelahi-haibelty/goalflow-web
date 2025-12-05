"use client";

import { Column } from "@/generated/prisma/client";

type Props = {
  data: Column;
};

function ColumnHeader({ data }: Props) {
  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      <div className="w-full text-sm  px-2.5 py-1 h-7 font-medium border-transparent">
        {data.name}
      </div>
    </div>
  );
}

export default ColumnHeader;
