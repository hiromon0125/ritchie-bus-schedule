import type { StylesConfig } from "react-select";

const selectStyles: StylesConfig<{ value: number; label: string }> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
    ":hover": {
      borderColor: "black",
      backgroundColor: "rgb(226 232 240 / var(--tw-bg-opacity))",
    },
  }),
};

export default selectStyles;
