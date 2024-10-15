import { Icon, TabPanel, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import { DoneIcon } from '@/components/icons/done-icon';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const VaultSuccessStep = () => {
  const {
    screenSizes: { isMdHeight },
  } = useWorkspaceContext();
  return (
    <TabPanel p={0} minH={450} h="full" placeContent="center">
      <VStack mt={{ base: isMdHeight ? 50 : 60, xs: 30 }}>
        <Icon fontSize={100} as={DoneIcon} />
        <Text fontWeight={700} fontSize={16} color="grey.50">
          The vault has been created!
        </Text>
      </VStack>
    </TabPanel>
  );
};

export { VaultSuccessStep };
