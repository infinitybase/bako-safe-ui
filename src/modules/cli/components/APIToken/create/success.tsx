import { Box, HStack, Icon, Text, useClipboard, VStack } from 'bako-ui';
import { FiCheck as CheckIcon } from 'react-icons/fi';

import { CopyIcon } from '@/components';
import { DoneIcon } from '@/components/icons/done-icon';
import { UseAPITokenReturn } from '@/modules/cli/hooks';
import { AddressUtils } from '@/modules/core/utils';
import { useNotification } from '@/modules/notification/hooks';

interface CreateAPITokenSuccessProps {
  step: UseAPITokenReturn['steps']['step'];
  createdAPIKey: UseAPITokenReturn['create']['createdAPIKey']['value'];
}

const CreateAPITokenSuccess = (props: CreateAPITokenSuccessProps) => {
  const { step, createdAPIKey } = props;

  const clipboard = useClipboard({ value: createdAPIKey });
  const toast = useNotification();

  return (
    <Box p={0} h="full">
      <VStack h="full" minH={400}>
        <VStack gap={5} flex={1} alignItems="center" justifyContent="center">
          <Icon boxSize="100px" as={DoneIcon} />

          <VStack maxW={276} gap={4}>
            <Text fontWeight={700} fontSize={20} color="grey.75">
              {step.title}
            </Text>
            <Text
              fontWeight="normal"
              color="grey.400"
              fontSize="xs"
              // variant="description"
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
            <Text fontSize="xs" color="grey.75" truncate>
              {AddressUtils.format(createdAPIKey, 25)}
            </Text>
            <Icon
              as={CopyIcon}
              color="grey.425"
              fontSize="sm"
              cursor="pointer"
              id={'copy_form_api_token'}
              onClick={() => {
                clipboard.copy();
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
    </Box>
  );
};

export { CreateAPITokenSuccess };
