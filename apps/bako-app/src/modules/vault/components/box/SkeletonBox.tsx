import {
  Box,
  Button,
  HStack,
  SkeletonCircle,
  SkeletonText,
} from '@chakra-ui/react';
import { ChartBulletIcon } from '@bako-safe/ui/components';

const VaultBoxSkeleton = () => (
  <Box w="100%">
    <HStack width="100%" alignItems="center" spacing={5} mb={5}>
      <SkeletonCircle />
      <Box w="100%" maxW="100%">
        <SkeletonText w="100%" />
      </Box>
    </HStack>
    <Box w="100%">
      <Button
        w="100%"
        variant="primary"
        fontWeight="bold"
        leftIcon={<ChartBulletIcon mr={2} fontSize={22} />}
      >
        Create transaction
      </Button>
    </Box>
  </Box>
);

export { VaultBoxSkeleton };
