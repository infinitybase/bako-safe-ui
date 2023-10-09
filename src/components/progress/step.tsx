import { Box, HStack } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { TabState } from '@/modules';

export interface StepProgressProps {
  length: number;
  value: TabState;
}

const StepProgress = ({ value, length }: StepProgressProps) => {
  const maxWidth = useMemo(() => Math.round(100 / length), [length]);

  return (
    <HStack
      w="full"
      h={1}
      bgColor="dark.200"
      justifyContent="space-between"
      spacing={2}
    >
      {Array(length)
        .fill('')
        .map((_, index) => (
          <Box
            h={1}
            w="full"
            key={index}
            maxW={`${maxWidth}%`}
            bgColor={value >= index ? 'brand.500' : 'dark.200'}
          />
        ))}
    </HStack>
  );
};

export { StepProgress };
