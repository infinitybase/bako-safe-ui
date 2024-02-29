import { Box, Heading, Text, VStack } from '@chakra-ui/react';

import { NotFoundIcon } from '@/components';

export const SelectionEmptyState = () => {
  return (
    <VStack spacing={0}>
      <Box mb={4}>
        <NotFoundIcon w={100} h={100} />
      </Box>

      <Box mb={4}>
        <Heading color="brand.500" fontSize="4xl">
          No workspace found
        </Heading>
      </Box>

      <Box maxW={340} mb={4}>
        <Text
          color="grey.200"
          fontSize="md"
          textAlign="center"
          fontWeight="bold"
        >
          You are not currently a member of any workspace. Would you like to
          create your first one now?
        </Text>
      </Box>
    </VStack>
  );
};
