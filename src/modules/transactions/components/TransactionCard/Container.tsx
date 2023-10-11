import { CardProps, Collapse, HStack, Text, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { Card } from '@/components';
import { TransactionState } from '@/modules/core';

interface TransactionCardContainerProps extends CardProps {
  children: ReactNode;
  status: TransactionState;
  isExpanded: boolean;
}

const Container = ({
  status,
  children,
  isExpanded,
  ...rest
}: TransactionCardContainerProps) => {
  const { isSigned, isCompleted, isDeclined, isReproved } = status;
  const missingSignature =
    !isSigned && !isCompleted && !isDeclined && !isReproved;

  return (
    <Card
      w="full"
      py={5}
      bgColor={missingSignature ? 'warning.800' : 'dark.300'}
      borderColor={missingSignature ? 'warning.500' : 'dark.100'}
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
};

export { Container };
