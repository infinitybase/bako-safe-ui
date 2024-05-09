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
  dividerBorderColor?: string;
}
export interface DialogActionProps extends ButtonProps {}

const DialogActions = ({
  children,
  hideDivider,
  dividerBorderColor,
  ...rest
}: DialogActionsProps) => (
  <Box w="full" {...rest}>
    <Divider
      hidden={hideDivider}
      my={{ base: 3, sm: 6 }}
      borderColor={dividerBorderColor ?? 'unset'}
    />
    <HStack spacing={4} justifyContent="center">
      {children}
    </HStack>
  </Box>
);

const DialogPrimaryAction = (props: DialogActionProps) => (
  <Button w="full" variant="primary" {...props} />
);

const DialogSecondaryAction = (props: DialogActionProps) => (
  <Button
    w="25%"
    variant="secondary"
    bgColor="transparent"
    border="1px solid white"
    _hover={{
      borderColor: 'brand.500',
      color: 'brand.500',
    }}
    {...props}
  />
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
