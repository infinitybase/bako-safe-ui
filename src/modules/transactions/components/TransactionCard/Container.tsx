import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  CardProps,
  Grid,
  HStack,
  VStack,
} from '@chakra-ui/react';
import React, { ReactNode } from 'react';

import { Card } from '@/components';
import { TransactionState } from '@/modules/core';

interface TransactionCardContainerProps extends CardProps {
  children: ReactNode;
  status: TransactionState;
  details: ReactNode;
}

const Container = ({
  status,
  details,
  children,
  ...rest
}: TransactionCardContainerProps) => {
  const { isSigned, isCompleted, isDeclined, isReproved } = status;
  const missingSignature =
    !isSigned && !isCompleted && !isDeclined && !isReproved;

  const childrens = React.Children.toArray(children);
  const gridTemplateColumns =
    childrens.length === 7 ? '1fr 1fr 1fr 1fr 1fr 2fr' : '1fr 1fr 2fr 2fr 4fr';

  return (
    <Card
      py={4}
      px={4}
      w="full"
      as={AccordionItem}
      bgColor={missingSignature ? 'warning.800' : 'grey.800'}
      borderColor={missingSignature ? 'warning.500' : 'dark.100'}
      minW="min-content"
      {...rest}
    >
      <VStack justifyContent="center" gap={0} w="full">
        <HStack
          as={AccordionButton}
          w="full"
          _hover={{ bgColor: 'transparent' }}
        >
          <Grid w="100%" gap={0} templateColumns={gridTemplateColumns}>
            {children}
          </Grid>
        </HStack>

        <Box w="full">
          <AccordionPanel px={4} w="full">
            {details}
          </AccordionPanel>
        </Box>
      </VStack>
    </Card>
  );
};

export { Container };
