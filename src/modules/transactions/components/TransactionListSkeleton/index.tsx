import { Skeleton, Stack, VStack } from 'bako-ui';

export const TransactionListSkeleton = () => {
  return (
    <Stack gap={3} w="full" alignItems="flex-start">
      <Skeleton w="160px" h="20px" />

      <Stack gap={3} w="full">
        {[...Array(3)].map((_, index) => (
          <VStack key={index} w="full" gap={2} h="75px" rounded="lg">
            <Skeleton h="full" w="full" variant="shine" />
          </VStack>
        ))}
      </Stack>
    </Stack>
  );
};
