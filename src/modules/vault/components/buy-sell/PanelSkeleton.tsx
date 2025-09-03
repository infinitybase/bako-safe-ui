import { Skeleton, Stack } from '@chakra-ui/react';

export const PanelSkeleton = () => {
  return (
    <Stack gap={2}>
      <Skeleton height="80px" />
      <Skeleton height="180px" />
      <Skeleton height="180px" />
      <Skeleton height="80px" />
    </Stack>
  );
};
