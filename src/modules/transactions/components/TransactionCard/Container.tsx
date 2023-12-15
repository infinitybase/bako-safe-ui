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
    childrens.length === 7 ? '2fr 1fr 1fr 2fr 2fr 4fr' : '1fr 1fr 2fr 2fr 4fr';

  return (
    <Card
      py={4}
      px={2}
      w="full"
      as={AccordionItem}
      bgColor={missingSignature ? 'warning.800' : 'dark.300'}
      borderColor={missingSignature ? 'warning.500' : 'dark.100'}
      {...rest}
    >
      <VStack justifyContent="flex-start" gap={0} w="full">
        <HStack
          as={AccordionButton}
          w="full"
          spacing={10}
          _hover={{ bgColor: 'transparent' }}
        >
          <Grid w="full" gap={4} templateColumns={gridTemplateColumns}>
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
