import { Heading, HStack, Text, VStack } from 'bako-ui';

import { LineCloseIcon } from '@/components';

import { useHeader } from './hooks/useHeader';

interface HeaderProps {
  title: string;
  description?: string;
  onClose?: () => void;
}

const Header = ({
  title,
  description,
  onClose = window.close,
}: HeaderProps) => {
  const { renderCloseIcon } = useHeader();

  return (
    <HStack w="full" justifyContent="space-between" alignItems="center" py={4}>
      <VStack gap={4} align="flex-start">
        <Heading
          fontSize={14}
          fontWeight={600}
          lineHeight="10px"
          color="gray.100"
        >
          {title}
        </Heading>
        {description && (
          <Text fontWeight={400} color="gray.400" fontSize="xs">
            {description}
          </Text>
        )}
      </VStack>
      {renderCloseIcon && (
        <LineCloseIcon
          mr={2}
          onClick={onClose}
          cursor="pointer"
          fontSize="24px"
          aria-label="Close window"
        />
      )}
    </HStack>
  );
};

export { Header };
