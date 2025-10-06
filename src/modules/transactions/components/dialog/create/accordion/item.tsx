import {
  AccordionPanel,
  Box,
  Heading,
  useAccordionItemState,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

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
  const {
    screenSizes: { isExtraSmall },
  } = useWorkspaceContext();
  const { isOpen } = useAccordionItemState();

  const flexDirection = useMemo(
    () => (isExtraSmall ? 'column' : 'row'),
    [isExtraSmall],
  );

  return (
    <>
      <Box p={0} alignItems="center" justifyContent="space-between">
        <VStack w="full" py={5} px={5} alignItems="flex-start" spacing={0}>
          <Box
            w="full"
            display="flex"
            flexDir={flexDirection}
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
      {isOpen && <AccordionPanel px={5}>{children}</AccordionPanel>}
    </>
  );
};

export { AccordionItem };
