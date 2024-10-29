import { APIToken } from '@bako-safe/services/modules/cli';
import { LineCloseIcon, RemoveIcon } from '@bako-safe/ui/components';
import {
  Button,
  Card,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';

import { useRemoveAPIToken } from '@/modules/cli/hooks/APIToken/remove';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface APITokenCardProps {
  apiToken: APIToken;
}

const APITokenCard = (props: APITokenCardProps) => {
  const { apiToken } = props;
  const { confirm, handler, request } = useRemoveAPIToken();
  const {
    screenSizes: { isLitteSmall },
  } = useWorkspaceContext();

  return (
    <Card
      key={apiToken.id}
      w="full"
      maxW={440}
      bg="dark.950"
      borderWidth={1}
      borderColor="grey.925"
      p={4}
      borderRadius={8}
    >
      <HStack alignItems="center" justifyContent="space-between" spacing={4}>
        <VStack
          spacing={3}
          alignItems="flex-start"
          justifyContent="space-between"
          w="full"
        >
          <Text
            color="grey.50"
            fontSize="xs"
            fontWeight={700}
            maxW="full"
            noOfLines={1}
            wordBreak="break-all"
          >
            {apiToken.name}
          </Text>
          <Text
            color="grey.250"
            fontSize="xs"
            maxW="full"
            noOfLines={4}
            wordBreak="break-all"
            hidden={!apiToken.config?.transactionTitle}
          >
            Transaction name: {apiToken.config?.transactionTitle}
          </Text>
          <Text color="grey.250" fontSize="xs">
            Creation date: {format(new Date(apiToken.createdAt), 'yyyy/MM/dd')}
          </Text>{' '}
          d
        </VStack>

        <Stack
          flexDirection={{
            base: confirm.show && isLitteSmall ? 'column' : 'row',
            xs: 'row',
          }}
          spacing={4}
          flex={1}
          maxW={{
            base: isLitteSmall ? 70 : 'unset',
            xs: 'unset,',
          }}
          alignItems="center"
          justifyContent="flex-end"
        >
          {confirm.show && (
            <>
              <LineCloseIcon
                visibility={confirm.show ? 'visible' : 'hidden'}
                fontSize="lg"
                color="grey.75"
                cursor="pointer"
                onClick={() => confirm.set(false)}
              />

              <Button
                variant="tertiary"
                border="none"
                color="grey.825"
                h="28px"
                py={0}
                px={4}
                fontSize="xs"
                fontWeight={700}
                onClick={() => handler(apiToken.id)}
                isLoading={request.isLoading}
              >
                Delete
              </Button>
            </>
          )}

          {!confirm.show && (
            <Icon
              visibility={confirm.show ? 'hidden' : 'visible'}
              as={RemoveIcon}
              fontSize="md"
              color="grey.75"
              cursor="pointer"
              onClick={() => confirm.set(true)}
            />
          )}
        </Stack>
      </HStack>
    </Card>
  );
};

export { APITokenCard };
