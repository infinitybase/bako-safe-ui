import { CopyIcon, DoneIcon } from '@bako-safe/ui/components';
import { CheckIcon } from '@chakra-ui/icons';
import {
  HStack,
  Icon,
  TabPanel,
  Text,
  useClipboard,
  VStack,
} from '@chakra-ui/react';

import { UseAPITokenReturn } from '@/modules/cli/hooks';
import { AddressUtils } from '@/modules/core/utils';
import { useNotification } from '@/modules/notification/hooks';

interface CreateAPITokenSuccessProps {
  step: UseAPITokenReturn['steps']['step'];
  createdAPIKey: UseAPITokenReturn['create']['createdAPIKey']['value'];
}

const CreateAPITokenSuccess = (props: CreateAPITokenSuccessProps) => {
  const { step, createdAPIKey } = props;

  const clipboard = useClipboard(createdAPIKey);
  const toast = useNotification();

  return (
    <TabPanel p={0} h="full">
      <VStack h="full" minH={400}>
        <VStack
          spacing={5}
          flex={1}
          alignItems="center"
          justifyContent="center"
        >
          <Icon fontSize={100} as={DoneIcon} />

          <VStack maxW={276} spacing={4}>
            <Text fontWeight={700} fontSize={20} color="grey.75">
              {step.title}
            </Text>
            <Text
              fontWeight="normal"
              color="grey.400"
              fontSize="xs"
              variant="description"
            >
              {step.description}
            </Text>
          </VStack>
        </VStack>

        <HStack
          w="full"
          alignItems="center"
          justifyContent="space-between"
          p={2}
          bg="grey.825"
          borderColor="grey.950"
          borderWidth={1}
          borderRadius={8}
        >
          <Text fontSize="xs" color="grey.425">
            API Key
          </Text>

          <HStack gap={2} maxW="60%">
            <Text fontSize="xs" color="grey.75" isTruncated>
              {AddressUtils.format(createdAPIKey, 25)}
            </Text>
            <Icon
              as={CopyIcon}
              color="grey.425"
              fontSize="sm"
              cursor="pointer"
              onClick={() => {
                clipboard.onCopy();
                toast({
                  position: 'top-right',
                  duration: 2000,
                  isClosable: false,
                  title: 'Copied to clipboard',
                  icon: (
                    <Icon fontSize="2xl" color="brand.500" as={CheckIcon} />
                  ),
                });
              }}
            />
          </HStack>
        </HStack>
      </VStack>
    </TabPanel>
  );
};

export { CreateAPITokenSuccess };
