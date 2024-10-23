import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

import { inputStyle } from "./input";

const baseStyle = defineStyle({
  field: inputStyle.field,
  icon: {
    color: "grey.200",
  },
});

const darkStyle = defineStyle({
  ...baseStyle,
  field: {
    ...baseStyle.field,
    bg: `grey.825`,
  },
});

const Select = defineStyleConfig({
  baseStyle,
  defaultProps: {
    colorScheme: "dark",
  },
  variants: {
    custom: baseStyle,
    dark: darkStyle,
  },
});

export { Select };
