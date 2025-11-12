import { Flex, Text } from 'bako-ui';

import { ChevronDown2Icon } from '@/components';

interface OperationArrowDisplayProps {
  label: string;
}

export const OperationArrowDisplay = ({
  label,
}: OperationArrowDisplayProps) => (
  <Flex w="full" alignItems="center" p={4} gap={3} align="center">
    <ChevronDown2Icon color="gray.400" w={9} h={4} />
    <Text fontWeight={500} color="gray.400" fontSize="xs" lineHeight="12px">
      {label}
    </Text>
  </Flex>
);
