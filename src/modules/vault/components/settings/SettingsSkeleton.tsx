import { Card, Flex, HStack, Skeleton, Stack } from 'bako-ui';

export const SettingsOverviewSkeleton = () => {
  return (
    <HStack gap={10} w="full" flexDirection={{ base: 'column', sm: 'row' }}>
      <Card.Root
        rounded="2xl"
        variant="subtle"
        bg="bg.panel"
        flex={1}
        alignSelf="stretch"
      >
        <Card.Header flexDirection="row" alignItems="center">
          <Skeleton height="20px" width="150px" />
          <Flex alignItems="center" gap={2} ml="auto">
            <Skeleton height="14px" width="14px" />
            <Skeleton height="14px" width="14px" />
          </Flex>
        </Card.Header>
        <Card.Body justifyContent="center">
          <Skeleton height="30px" width="220px" />
        </Card.Body>
        <Card.Footer
          gap={{ base: 2, md: 6 }}
          flexWrap={{ base: 'wrap', sm: 'nowrap' }}
        >
          <Skeleton height="30px" w={{ base: 'full', md: '241px' }} />
          <Skeleton height="30px" w={{ base: 'full', md: '241px' }} />
        </Card.Footer>
      </Card.Root>

      <Card.Root rounded="2xl" variant="subtle" bg="bg.panel" p={6}>
        <Skeleton height="160px" width="160px" />
      </Card.Root>
    </HStack>
  );
};

export const SettingsSignersSkeleton = () => {
  return (
    <Card.Root variant="subtle" rounded="2xl" bg="bg.panel" w="full">
      <Card.Header>
        <Skeleton height="20px" width="120px" />
      </Card.Header>
      <Card.Body display="flex" flexDirection="column">
        <Flex
          py={4}
          borderTop="1px solid"
          borderBottom="1px solid"
          borderColor="bg.muted"
          gap={4}
          w="full"
        >
          <Skeleton boxSize="40px" />
          <Stack gap={3} flex={1}>
            <Flex alignItems="center" flex={1}>
              <Skeleton height="10px" width="60px" mr={2} />
              <Skeleton height="10px" width="50px" />
              <Skeleton height="24px" width="24px" ml="auto" />
            </Flex>
            <Skeleton height="12px" width="100%" />
          </Stack>
        </Flex>

        <Flex
          py={4}
          borderTop="1px solid"
          borderBottom="1px solid"
          borderColor="bg.muted"
          gap={4}
          w="full"
        >
          <Skeleton boxSize="40px" />
          <Stack gap={3} flex={1}>
            <Flex alignItems="center" flex={1}>
              <Skeleton height="10px" width="60px" mr={2} />
              <Skeleton height="10px" width="50px" />
              <Skeleton height="24px" width="24px" ml="auto" />
            </Flex>
            <Skeleton height="12px" width="100%" />
          </Stack>
        </Flex>

        <Flex
          py={4}
          borderTop="1px solid"
          borderBottom="1px solid"
          borderColor="bg.muted"
          gap={4}
          w="full"
        >
          <Skeleton boxSize="40px" />
          <Stack gap={3} flex={1}>
            <Flex alignItems="center" flex={1}>
              <Skeleton height="10px" width="60px" mr={2} />
              <Skeleton height="10px" width="50px" />
              <Skeleton height="24px" width="24px" ml="auto" />
            </Flex>
            <Skeleton height="12px" width="100%" />
          </Stack>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};
