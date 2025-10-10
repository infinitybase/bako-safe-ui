import { Box, HStack } from '@chakra-ui/react';
import { useMemo } from 'react';

export interface StepProgressProps {
  length: number;
  value: number;
}

const StepProgress = ({ value, length }: StepProgressProps) => {
  const maxWidth = useMemo(() => Math.round(100 / length), [length]);

  return (
    <HStack
      w="full"
      h={1}
      bgColor="dark.200"
      justifyContent="space-between"
      rounded="full"
      gap={2}
    >
      {Array(length)
        .fill('')
        .map((_, index) => (
          <Box
            rounded="full"
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
