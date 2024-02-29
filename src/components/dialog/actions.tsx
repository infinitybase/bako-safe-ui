import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Divider,
  HStack,
} from '@chakra-ui/react';

export interface DialogActionsProps extends BoxProps {
  hideDivider?: boolean;
}
export interface DialogActionProps extends ButtonProps {}

const DialogActions = ({
  children,
  hideDivider,
  ...rest
}: DialogActionsProps) => (
  <Box w="full" {...rest}>
    <Divider hidden={hideDivider} borderColor="dark.100" my={9} />
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

const DialogTertiaryAction = (props: DialogActionProps) => (
  <Button variant="tertiary" bgColor="error.900" border="none" {...props} />
);

export {
  DialogActions,
  DialogPrimaryAction,
  DialogSecondaryAction,
  DialogTertiaryAction,
};
