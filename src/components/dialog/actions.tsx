import { Box, BoxProps, Button, ButtonProps, HStack } from 'bako-ui';

export interface DialogActionsProps extends BoxProps {}
export interface DialogActionProps extends ButtonProps {}

const DialogActions = ({
  children,
  flexWrap,
  flexDir,
  flexDirection,
  ...rest
}: DialogActionsProps) => (
  <Box w="full" {...rest}>
    <HStack
      flexDir={flexDir}
      flexDirection={flexDirection}
      flexWrap={flexWrap}
      gap={4}
      justifyContent="center"
      flex={1}
    >
      {children}
    </HStack>
  </Box>
);

const DialogPrimaryAction = (props: DialogActionProps) => (
  <Button w="full" colorPalette="primary" {...props} />
);

const DialogSecondaryAction = (props: DialogActionProps) => (
  <Button w="25%" variant="subtle" {...props} />
);

const DialogTertiaryAction = (props: DialogActionProps) => (
  <Button
    colorPalette="tertiary"
    bgColor="error.900"
    border="none"
    {...props}
  />
);

export {
  DialogActions,
  DialogPrimaryAction,
  DialogSecondaryAction,
  DialogTertiaryAction,
};
