import { Box, Divider, Heading, Text, VStack } from '@chakra-ui/react';
import { UserWorkspaceIcon } from '@bako-safe/ui/components';

import { useWorkspaceContext } from '../../WorkspaceProvider';

export const SelectionEmptyState = () => {
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  return (
    <VStack spacing={4}>
      <Box mb={4}>
        <UserWorkspaceIcon w={100} h={100} />
      </Box>

      <Box mb={4}>
        <Heading color="white" fontSize="3xl" textAlign="center">
          No workspace found
        </Heading>
      </Box>

      <Box maxW={420} mb={4}>
        <Text color="grey.200" fontSize="sm" textAlign="center">
          You are not currently a member of any workspace. Would you like to
          create your first one now?
        </Text>
      </Box>

      <Divider
        position="absolute"
        left={0}
        bottom={0}
        borderWidth={1}
        borderColor="grey.600"
        my={1}
        hidden={isMobile}
      />
    </VStack>
  );
};
