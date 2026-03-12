import { HStack, HStackProps, Text } from 'bako-ui';

import { Warning3Icon } from '@/components';

interface Props extends HStackProps {
  type: 'red' | 'yellow';
  text: string;
}

export const TransactionAlert = (props: Props) => {
  const { type, text } = props;
  const baseColor = type === 'red' ? 'red.100' : 'yellow.100';
  return (
    <HStack
      gap={3}
      align="center"
      bg={`${baseColor}/8`}
      borderRadius="8px"
      p={3}
      w="full"
      {...props}
    >
      <Warning3Icon color={baseColor} h={4} w={9} />
      <Text color={baseColor} fontSize={12} fontWeight={400} lineHeight="12px">
        {text}
      </Text>
    </HStack>
  );
};
