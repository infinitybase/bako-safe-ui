import {
  Box,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useClipboard,
  VStack,
} from 'bako-ui';
import { RiFileCopyFill } from 'react-icons/ri';

import { CopyTopMenuIcon } from '@/components/icons/copy-top-menu';
import { DoneIcon } from '@/components/icons/done-icon';
import { UseAPITokenReturn } from '@/modules/cli/hooks';
import { AddressUtils } from '@/modules/core/utils';

interface CreateAPITokenSuccessProps {
  step: UseAPITokenReturn['steps']['step'];
  createdAPIKey: UseAPITokenReturn['create']['createdAPIKey']['value'];
}

const CreateAPITokenSuccess = (props: CreateAPITokenSuccessProps) => {
  const { step, createdAPIKey } = props;

  const { copy, copied } = useClipboard({ value: createdAPIKey });

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
                  w="16px"
                  color="textPrimary"
                />
              </IconButton>
            </Tooltip>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export { CreateAPITokenSuccess };
