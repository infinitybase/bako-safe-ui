import { CardProps, Collapse, HStack, Text, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { Card } from '@/components';

interface TransactionCardContainerProps extends CardProps {
  children: ReactNode;
  isPending?: boolean;
  isExpanded: boolean;
}

const Container = ({
  isPending,
  children,
  isExpanded,
  ...rest
}: TransactionCardContainerProps) => (
  <Card
    w="full"
    bgColor={isPending ? 'warning.800' : 'dark.300'}
    borderColor={isPending ? 'warning.500' : 'dark.100'}
    {...rest}
  >
    <VStack w="full">
      <HStack w="full" alignItems="center" spacing={10}>
        {children}
      </HStack>

      <Collapse in={isExpanded}>
        <Text>Okokokoko</Text>
        <Text>Okokokoko</Text>
        <Text>Okokokoko</Text>
      </Collapse>
    </VStack>
  </Card>
);

export { Container };
