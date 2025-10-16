import { Box, Icon, Text, VStack } from 'bako-ui';

import { DoneIcon } from '@/components/icons/done-icon';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

const VaultSuccessStep = () => {
  const {
    screenSizes: { isMdHeight },
  } = useWorkspaceContext();
  return (
    <Box p={0} minH={450} h="full" placeContent="center">
      <VStack mt={{ base: isMdHeight ? 50 : 60, sm: 30 }}>
        <Icon w="100px" as={DoneIcon} />
        <Text fontWeight={700} fontSize={16} color="grey.50">
          The vault has been created!
        </Text>
      </VStack>
    </Box>
  );
};

export { VaultSuccessStep };
