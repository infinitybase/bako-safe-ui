import { Box, BoxProps, Button, ButtonProps, HStack, Separator } from 'bako-ui';

export interface DialogActionsProps extends BoxProps {
  hideDivider?: boolean;
  dividerBorderColor?: string;
}
export interface DialogActionProps extends ButtonProps {}

const DialogActions = ({
  children,
  dividerBorderColor,
  flexWrap,
  flexDir,
  flexDirection,
  hideDivider,
  ...rest
}: DialogActionsProps) => (
  <Box w="full" {...rest}>
    <Separator
      hidden={hideDivider}
      my={{ base: 3, sm: 6 }}
      borderColor={dividerBorderColor ?? 'unset'}
    />
    <HStack
      flexDir={flexDir}
      flexDirection={flexDirection}
      flexWrap={flexWrap}
      gap={4}
      justifyContent="center"
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
