import { Box, BoxProps } from 'bako-ui';

interface DialogBody extends BoxProps {}

const DialogBody = ({ children, ...rest }: DialogBody) => (
  <Box w="full" {...rest}>
    {children}
  </Box>
);

export { DialogBody };
