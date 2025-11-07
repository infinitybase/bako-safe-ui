import { Skeleton, Stack } from 'bako-ui';

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
