import React, { ReactNode } from "react";

type ColumnWrapperProps = {
  children: ReactNode;
};

function ColumnWrapper({ children }: ColumnWrapperProps) {
  return <li className="shrink-0 w-[272px] h-full select-none">{children}</li>;
}

export default ColumnWrapper;
