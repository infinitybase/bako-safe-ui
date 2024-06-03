import {
  AccordionPanel,
  Box,
  Heading,
  useAccordionItemState,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import { useScreenSize } from '@/modules/core';

interface AccordionItemProps {
  title: string;
  actions: React.ReactNode;
  resume: React.ReactNode;
  children: React.ReactNode;
  // isExpanded?: boolean;
}

const AccordionItem = ({
  title,
  actions,
  children,
  resume,
  // isExpanded,
}: AccordionItemProps) => {
  const { isExtraSmall } = useScreenSize();
  const { isOpen } = useAccordionItemState();

  console.log('isOpen on the item', isOpen);

  return (
    <>
      <Box p={0} alignItems="center" justifyContent="space-between">
        <VStack w="full" py={5} px={5} alignItems="flex-start" spacing={0}>
          <Box
            w="full"
            display="flex"
            flexDir={isExtraSmall ? 'column' : 'row'}
            alignItems="start"
            rowGap={6}
          >
            <Box w="full" flex={2}>
              <Heading fontSize="lg" fontWeight="extrabold" color="grey.200">
                {title}
              </Heading>
              {!isOpen && resume}
            </Box>
            {actions}
          </Box>
        </VStack>
      </Box>
      <AccordionPanel px={5}>{children}</AccordionPanel>
    </>
  );
};

export { AccordionItem };
