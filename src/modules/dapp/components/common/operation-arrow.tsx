import { Flex, Text } from 'bako-ui';

import { ChevronDown2Icon } from '@/components/icons';

interface DappOperationArrowProps {
  label: string;
}

const DappOperationArrow = ({ label }: DappOperationArrowProps) => (
  <Flex w="full" alignItems="center" p={4} gap={3} align="center">
    <ChevronDown2Icon color="gray.400" w={9} h={4} />
    <Text fontWeight={500} color="gray.400" fontSize="xs" lineHeight="12px">
      {label}
    </Text>
  </Flex>
);

export { DappOperationArrow };
