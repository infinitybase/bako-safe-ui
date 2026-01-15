import {
  Box,
  Stack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useClipboard,
  VStack,
} from 'bako-ui';
import { RiFileCopyFill } from 'react-icons/ri';
import { formatCreatedDate } from "@/utils/format-date-full";

import { CopyTopMenuIcon } from '@/components/icons/copy-top-menu';
import { DoneIcon } from '@/components/icons/done-icon';
import { UseAPITokenReturn } from '@/modules/cli/hooks';
import { Dialog } from "@/components";

interface CreateAPITokenSuccessProps {
  step: UseAPITokenReturn['steps']['step'];
  createdAPIKey: UseAPITokenReturn['create']['createdAPIKey']['value'];
  steps: any;
  name?: string;
  transactionTitle?: string;
}

const CreateAPITokenSuccess = (props: CreateAPITokenSuccessProps) => {
  const { createdAPIKey, name, transactionTitle, steps } = props;

  const { copy, copied } = useClipboard({ value: createdAPIKey });

  return (
    <Box p={6} h="full">
      <VStack h="full" minH={400}>
        <VStack gap={5} flex={1} alignItems="center" justifyContent="center">
          <Icon boxSize="48px" as={DoneIcon} />

          <VStack maxW={400} gap={4}>
            <Text fontWeight={700} fontSize={16} color="gray.50">
              API Token created!
            </Text>
            <Text
              fontWeight="normal"
              color="gray.400"
              fontSize={14}
              textAlign="center"
            >
              This is your API key, you can use this to manage your deploys through a transaction inside Bako.
            </Text>
          </VStack>
        </VStack>
        <VStack
          w="full"
          h="auto"
          maxH={200}
          bg="gray.600"
          p={3}
          borderColor="gray.600"
          alignItems="start"
          borderWidth={1}
          borderRadius={8}
          display="flex"
          flexDirection="column"
        >
          <Box w="full" display="flex" justifyContent="space-between">
            <Text fontSize="xs" color="gray.100">
              {name}
            </Text>
            <Tooltip
              content={copied ? 'Copied' : 'Copy'}
              contentProps={{
                bg: 'bg.muted',
                color: 'textPrimary',
                borderRadius: 'lg',
              }}
              positioning={{ placement: 'top' }}
              showArrow={false}
            >
              <IconButton
                variant="plain"
                cursor="pointer"
                size="xs"
                boxSize="20px"
                minW="20px"
                aria-label="Copy API Token"
                onClick={copy}
              >
                <Icon
                  as={copied ? RiFileCopyFill : CopyTopMenuIcon}
                  w="12px"
                  color="gray.200"
                />
              </IconButton>
            </Tooltip>
          </Box>
          <Text fontSize="xs" color="gray.300" wordBreak="break-all">
            {createdAPIKey}
          </Text>
          <Stack spacing={0} gap={0}>
            {transactionTitle && (
              <Text fontSize="xs" color="gray.300" wordBreak="break-all">
                {`Transaction name: ${transactionTitle}`}
              </Text>
            )}
            <Text fontSize="xs" color="gray.300" wordBreak="break-all">
              {`Created: ${formatCreatedDate({ date: new Date() })}`}
            </Text>
          </Stack>
        </VStack>
        <VStack
          w="full"
          mt={3}
          roundedBottom={{ base: 'none', sm: '2xl' }}
        >
          <Dialog.Actions>
            <Dialog.PrimaryAction
              flex={3}
              onClick={steps.step.primaryAction.handler}
              loading={steps.step.primaryAction.isLoading}
              aria-label={'Primary action create api token'}
              bg="gray.600"
              color="gray.300"
              _hover={{ bg: 'gray.500' }}
            >
              {steps.step.primaryAction.label}
            </Dialog.PrimaryAction>
          </Dialog.Actions>
        </VStack>
      </VStack>
    </Box>
  );
};

export { CreateAPITokenSuccess };
