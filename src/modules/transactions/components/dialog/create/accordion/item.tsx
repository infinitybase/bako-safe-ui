import {
  AccordionPanel,
  Box,
  Heading,
  HStack,
  useAccordionItemState,
} from '@chakra-ui/react';
import React from 'react';

interface AccordionItemProps {
  title: string;
  actions: React.ReactNode;
  resume: React.ReactNode;
  children: React.ReactNode;
}

const AccordionItem = ({
  title,
  actions,
  children,
  resume,
}: AccordionItemProps) => {
  const { isOpen } = useAccordionItemState();

  return (
    <>
      <HStack w="full" h={isOpen ? '32px' : '90px'} px={5} my={isOpen ? 4 : 0}>
        <Box w="full">
          <Heading variant="dialogSectionTitle">{title}</Heading>
          {!isOpen && resume}
        </Box>
        {actions}
      </HStack>

      {isOpen && <AccordionPanel px={5}>{children}</AccordionPanel>}
    </>
  );
};

export { AccordionItem };
