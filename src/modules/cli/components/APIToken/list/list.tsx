import {
  Box,
  Button,
  Card,
  HStack,
  Icon,
  Separator,
  Stack,
  Text,
  VStack,
} from 'bako-ui';
import { format } from 'date-fns';

import { CustomSkeleton, LineCloseIcon, RemoveIcon } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { TabState, UseAPITokenReturn } from '@/modules/cli/hooks';
import { useRemoveAPIToken } from '@/modules/cli/hooks/APIToken/remove';
import { APIToken } from '@/modules/cli/services';
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
    <Card.Root
      key={apiToken.id}
      w="full"
      maxW={440}
      bg="dark.950"
      borderWidth={1}
      borderColor="grey.925"
      p={4}
      borderRadius={8}
    >
      <HStack alignItems="center" justifyContent="space-between" gap={4}>
        <VStack
          gap={3}
          alignItems="flex-start"
          justifyContent="space-between"
          w="full"
        >
          <Text
            color="grey.50"
            fontSize="xs"
            fontWeight={700}
            maxW="full"
            lineClamp={1}
            wordBreak="break-all"
          >
            {apiToken.name}
          </Text>
          <Text
            color="grey.250"
            fontSize="xs"
            maxW="full"
            lineClamp={4}
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
            sm: 'row',
          }}
          gap={4}
          flex={1}
          maxW={{
            base: isLitteSmall ? 70 : 'unset',
            sm: 'unset,',
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
                colorPalette="tertiary"
                border="none"
                color="grey.825"
                h="28px"
                py={0}
                px={4}
                fontSize="xs"
                fontWeight={700}
                onClick={() => handler(apiToken.id)}
                loading={request.isLoading}
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
    </Card.Root>
  );
};

interface APITokensListProps {
  tabs: UseAPITokenReturn['tabs'];
  request: UseAPITokenReturn['list']['request'];
}

const APITokensList = (props: APITokensListProps) => {
  const { tabs, request } = props;

  const handleAddMoreAPITokens = () => {
    tabs.set(TabState.CREATE);
  };

  return (
    <Box p={0} display="flex" flexDirection="column" flex={1} minH="full">
      <Separator my={{ base: 3, sm: 6 }} borderColor="grey.425" />

      <VStack gap={{ base: 4, sm: 6 }} pt={{ base: 2, sm: 0 }} flex={1}>
        <CustomSkeleton loading={request.isLoading} flex={1} display="flex">
          {request.data && request.data?.length > 0 ? (
            <VStack
              gap={{ base: 4, sm: 6 }}
              w="full"
              maxH={{
                base: 'calc($100vh - 301px)',
                sm: 'calc($100vh - 320px)',
                md: 380,
              }}
              minH={300}
              flex={1}
              alignSelf="stretch"
              overflowY="scroll"
              css={{
                '&::-webkit-scrollbar': {
                  display: 'none',
                  width: '5px',
                  backgroundColor: '#2B2927',
                },
                '&::-webkit-scrollbar-thumb': {
                  display: 'none',
                  backgroundColor: 'grey.250',
                  borderRadius: '30px',
                  height: '10px' /* Adjust the height of the scrollbar thumb */,
                },
              }}
            >
              {request.data?.map((apiToken) => (
                <APITokenCard key={apiToken.id} apiToken={apiToken} />
              ))}
            </VStack>
          ) : (
            <EmptyState
              showAction={false}
              title="No Data available"
              subTitle="Currently, there is no available data to display in this section."
            />
          )}
        </CustomSkeleton>

        <Button
          colorPalette="emptyState"
          onClick={handleAddMoreAPITokens}
          w="full"
          mt="auto"
        >
          Add more API Tokens
        </Button>
      </VStack>
    </Box>
  );
};

export { APITokensList };
