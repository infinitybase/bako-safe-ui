import { Box, HStack } from 'bako-ui';
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
            bgColor={value >= index ? 'primary.main' : 'gray.600'}
          />
        ))}
    </HStack>
  );
};

export { StepProgress };
