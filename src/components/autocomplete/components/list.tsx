import { Box, Flex, VStack } from '@chakra-ui/react';
import React, { LegacyRef, memo } from 'react';

interface AutocompleteOptionListProps {
  children: React.ReactNode;
  rootRef?: LegacyRef<HTMLDivElement>;
}

const AutocompleteOptionList = memo(
  ({ children, rootRef }: AutocompleteOptionListProps) => {
    return (
      <Box
        bg="dark.200"
        ref={rootRef}
        color="grey.200"
        fontSize="md"
        borderColor="dark.100"
        borderWidth={1}
        borderRadius={10}
        padding={2}
        position="absolute"
        zIndex={300}
        w="full"
        mt={2}
      >
        <Flex display="flex" justifyContent="center" alignItems="center">
          <VStack
            w="full"
            maxH={194}
            gap={0}
            overflowY="scroll"
            css={{
              '&::-webkit-scrollbar': { width: '0' },
              scrollbarWidth: 'none',
            }}
          >
            {children}
          </VStack>
        </Flex>
      </Box>
    );
  },
);

AutocompleteOptionList.displayName = 'AutocompleteOptionList';

export default AutocompleteOptionList;
