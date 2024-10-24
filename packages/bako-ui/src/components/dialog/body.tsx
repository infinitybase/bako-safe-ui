import { Box, BoxProps } from "@chakra-ui/react";

export interface DialogBodyProps extends BoxProps {}

const DialogBody = ({ children, ...rest }: DialogBodyProps) => (
  <Box w="full" {...rest}>
    {children}
  </Box>
);

export { DialogBody };
