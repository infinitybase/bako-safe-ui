import { Flex, Heading, Icon, TabPanel, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import { DoneIcon } from '@/components/icons/done-icon';

interface VaultSuccessStepProp {
  stepProgress: React.JSX.Element;
}

const VaultSuccessStep = ({ stepProgress }: VaultSuccessStepProp) => {
  return (
    <TabPanel p={0} h={450}>
      <Flex
        flexDirection="column"
        h="100%"
        alignItems="center"
        justifyContent="space-between"
        pb={{ base: 'unset', xs: 12 }}
      >
        <Flex flexDir="column" gap="16px" mb={5}>
          <Heading fontSize={{ base: '16px', xs: '3xl' }} color="grey.50">
            All set!!
          </Heading>
          <Text
            fontWeight="normal"
            color="grey.400"
            fontSize={{ base: 'xs', xs: 'md' }}
            variant="description"
          >
            Your vault has been created successfully! You can now create
            transactions.
          </Text>

          {stepProgress}
        </Flex>

        <VStack mb={8}>
          <Icon fontSize={100} as={DoneIcon} />
          <Text fontWeight={700} fontSize={16} color="grey.50">
            The vault has been created!
          </Text>
        </VStack>
      </Flex>
    </TabPanel>
  );
};

export { VaultSuccessStep };
