import { Box, Flex, VStack } from 'bako-ui';
import React, { LegacyRef, memo } from 'react';

interface AutocompleteOptionListProps {
  children: React.ReactNode;
  rootRef?: LegacyRef<HTMLDivElement>;
}

const AutocompleteOptionList = memo(
  ({ children, rootRef }: AutocompleteOptionListProps) => {
    return (
      <Box
        bg="bg.muted"
        ref={rootRef}
        color="textPrimary"
        fontSize="md"
        borderColor="bg.panel/80"
        borderWidth={1}
        borderRadius={10}
        padding={2}
        position="absolute"
        zIndex={400}
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
