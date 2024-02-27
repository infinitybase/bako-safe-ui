import { Box, Divider, Heading, Text, VStack } from '@chakra-ui/react';

import { UserWorkspaceIcon } from '@/components/icons/user-workspace-icon';

export const SelectionEmptyState = () => {
  return (
    <VStack spacing={4}>
      <Box mb={4}>
        <UserWorkspaceIcon w={100} h={100} />
      </Box>

      <Box mb={4}>
        <Heading color="white" fontSize="3xl">
          No workspace found
        </Heading>
      </Box>

      <Box maxW={420} mb={4}>
        <Text
          color="grey.200"
          fontSize="sm"
          textAlign="center"
          fontWeight="bold"
        >
          You are not currently a member of any workspace. Would you like to
          create your first one now?
        </Text>
      </Box>

      <Divider borderWidth={1.5} borderColor="grey.600" my={1} />
    </VStack>
  );
};
