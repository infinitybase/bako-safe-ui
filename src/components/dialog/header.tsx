import {
  Box,
  Dialog,
  Heading,
  HeadingProps,
  HStack,
  StackProps,
  Text,
  VStack,
} from 'bako-ui';
import { JSX } from 'react';

import { LineCloseIcon } from '../icons';

interface DialogHeaderProps extends StackProps {
  title: string;
  description?: string | JSX.Element;
  descriptionFontSize?: string;
  descriptionColor?: string;
  hideCloseButton?: boolean;
  titleSxProps?: HeadingProps;
  onClose?: () => void;
}

const DialogHeader = ({
  title,
  description,
  descriptionFontSize,
  descriptionColor,
  hideCloseButton,
  onClose,
  titleSxProps,
  ...stackProps
}: DialogHeaderProps) => (
  <VStack
    w="full"
    mb={{ base: 6, sm: 12 }}
    mt={{ base: 0, sm: 6 }}
    gap={3}
    alignItems="flex-start"
    {...stackProps}
  >
    <HStack w="full" justifyContent="space-between" alignItems="center">
      <Heading
        fontSize={{ base: 'lg', sm: '3xl' }}
        color="white"
        {...titleSxProps}
      >
        {title}
      </Heading>
      {!hideCloseButton && (
        <Dialog.CloseTrigger asChild>
          <LineCloseIcon
            w="24px"
            aria-label="Close window"
            cursor="pointer"
            onClick={onClose}
          />
        </Dialog.CloseTrigger>
      )}
    </HStack>
    <Box maxW={500} mb={{ base: 4, sm: 0 }}>
      {description && (
        <Text
          color={descriptionColor}
          fontSize={{ base: 'sm', sm: descriptionFontSize }}
          // variant="description"
        >
          {description}
        </Text>
      )}
    </Box>
  </VStack>
);

export { DialogHeader };
