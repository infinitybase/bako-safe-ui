import { Card, Flex, Heading, HStack, Skeleton } from 'bako-ui';

const OverviewSkeleton = () => {
  return (
    <>
      <Card.Header>
        <HStack justifyContent="space-between" alignItems="center" w="full">
          <Heading color="textPrimary" fontSize="sm">
            <Skeleton width="100px" height="16px" />
          </Heading>

          <Flex gap={1} alignItems="center">
            <Skeleton width="20px" height="20px" />
            <Skeleton width="20px" height="20px" />
            <Skeleton width="20px" height="20px" />
            <Skeleton width="20px" height="20px" />
            <Skeleton width="20px" height="20px" />
          </Flex>
        </HStack>
        <Skeleton width="150px" height="12px" mt={2} />
      </Card.Header>
      <Card.Body justifyContent="center">
        <Skeleton width="300px" height="40px" />
      </Card.Body>
      <Card.Footer>
        <Skeleton width="80px" height="32px" />
        <Skeleton width="80px" height="32px" />
      </Card.Footer>
    </>
  );
};

export default OverviewSkeleton;
