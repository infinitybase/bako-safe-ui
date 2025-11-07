import { Card, Flex, Skeleton, Stack } from 'bako-ui';

export const AllocationSkeleton = () => {
  return (
    <>
      <Card.Header>
        <Flex justify="space-between" align="center">
          <Skeleton height="10px" width="100px" borderRadius="md" />
          <Flex gap={2}>
            <Skeleton height="20px" width="40px" borderRadius="md" />
            <Skeleton height="20px" width="40px" borderRadius="md" />
          </Flex>
        </Flex>
      </Card.Header>
      <Card.Body>
        <Flex
          justify="space-between"
          align="center"
          borderTop="1px solid"
          borderColor="bg.muted"
          py={4}
        >
          <Flex gap={2} alignItems="center">
            <Skeleton height="20px" width="20px" borderRadius="full" />
            <Skeleton height="15px" width="60px" borderRadius="md" />
          </Flex>
          <Stack gap={3} align="end">
            <Skeleton height="10px" width="80px" borderRadius="md" />
            <Skeleton height="10px" width="60px" borderRadius="md" />
          </Stack>
        </Flex>

        <Flex
          justify="space-between"
          align="center"
          borderTop="1px solid"
          borderColor="bg.muted"
          py={4}
        >
          <Flex gap={2} alignItems="center">
            <Skeleton height="20px" width="20px" borderRadius="full" />
            <Skeleton height="15px" width="60px" borderRadius="md" />
          </Flex>
          <Stack gap={3} align="end">
            <Skeleton height="10px" width="80px" borderRadius="md" />
            <Skeleton height="10px" width="60px" borderRadius="md" />
          </Stack>
        </Flex>

        <Flex
          justify="space-between"
          align="center"
          borderTop="1px solid"
          borderBottom="1px solid"
          borderColor="bg.muted"
          py={4}
        >
          <Flex gap={2} alignItems="center">
            <Skeleton height="20px" width="20px" borderRadius="full" />
            <Skeleton height="15px" width="60px" borderRadius="md" />
          </Flex>
          <Stack gap={3} align="end">
            <Skeleton height="10px" width="80px" borderRadius="md" />
            <Skeleton height="10px" width="60px" borderRadius="md" />
          </Stack>
        </Flex>
      </Card.Body>
    </>
  );
};
