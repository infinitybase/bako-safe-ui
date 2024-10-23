import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

interface DialogBody extends BoxProps {}

const DialogBody = ({ children, ...rest }: DialogBody) => (
  <Box w="full" {...rest}>
    {children}
  </Box>
);

export { DialogBody };
