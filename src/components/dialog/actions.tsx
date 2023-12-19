import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Divider,
  HStack,
} from '@chakra-ui/react';

export interface DialogActionsProps extends BoxProps {}
export interface DialogActionProps extends ButtonProps {}

const DialogActions = ({ children, ...rest }: DialogActionsProps) => (
  <Box w="full" {...rest}>
    <Divider borderColor="dark.100" my={9} />
    <HStack spacing={4} justifyContent="center">
      {children}
    </HStack>
  </Box>
);

const DialogPrimaryAction = (props: DialogActionProps) => (
  <Button variant="primary" {...props} />
);

const DialogSecondaryAction = (props: DialogActionProps) => (
  <Button variant="secondary" bgColor="dark.100" border="none" {...props} />
);

export { DialogActions, DialogPrimaryAction, DialogSecondaryAction };
