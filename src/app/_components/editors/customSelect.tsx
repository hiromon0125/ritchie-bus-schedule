import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type Select from "react-select";

const CustomSelect = dynamic<ComponentProps<Select>>(
  () => import("react-select"),
  {
    ssr: false,
  },
);

export default CustomSelect as Select;
