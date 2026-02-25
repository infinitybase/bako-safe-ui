import { Card, Flex, Skeleton } from 'bako-ui';

export const VaultInfoBoxSkeleton = () => {
  return (
    <Card.Root
      variant="subtle"
      rounded="lg"
      border="1px solid"
      borderColor="bg.muted"
    >
      <Card.Body display="flex" flexDirection="column" gap={1} w="full" p={3}>
        <Flex justifyContent="space-between" alignItems="center">
          <Skeleton height="14px" width="120px" />
          <Skeleton height="24px" width="24px" borderRadius="lg" />
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Skeleton height="14px" width="120px" />
          <Skeleton height="24px" width="24px" borderRadius="lg" />
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Skeleton height="14px" width="120px" />
          <Skeleton height="24px" width="24px" borderRadius="lg" />
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};
