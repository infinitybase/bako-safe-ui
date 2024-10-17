import {
  Box,
  Heading,
  HeadingProps,
  HStack,
  StackProps,
  Text,
  VStack,
} from '@chakra-ui/react';

import { LineCloseIcon } from '../icons';

interface DialogHeaderProps extends StackProps {
  title: string;
  description?: string;
  hideCloseButton?: boolean;
  titleSxProps?: HeadingProps;
  onClose?: () => void;
}

const DialogHeader = ({
  title,
  description,
  hideCloseButton,
  onClose,
  titleSxProps,
  ...stackProps
}: DialogHeaderProps) => (
  <VStack w="full" spacing={3} alignItems="flex-start" {...stackProps}>
    <HStack w="full" justifyContent="space-between" alignItems="center">
      <Heading variant="dialogTitle" {...titleSxProps}>
        {title}
      </Heading>
      {!hideCloseButton && (
        <LineCloseIcon
          fontSize="24px"
          aria-label="Close window"
          cursor="pointer"
          onClick={onClose}
        />
      )}
    </HStack>
    <Box maxW={500} mb={{ base: 4, sm: 0 }}>
      {description && <Text variant="dialogDescription">{description}</Text>}
    </Box>
  </VStack>
);

export { DialogHeader };
