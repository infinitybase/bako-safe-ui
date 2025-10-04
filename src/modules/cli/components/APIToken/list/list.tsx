import {
  Button,
  Card,
  Divider,
  HStack,
  Icon,
  Stack,
  TabPanel,
  Text,
  VStack,
} from '@chakra-ui/react';
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
              data-testid="delete-api-token"
            />
          )}
        </Stack>
      </HStack>
    </Card>
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
    <TabPanel p={0} display="flex" flexDirection="column" flex={1} minH="full">
      <Divider my={{ base: 3, sm: 6 }} borderColor="grey.425" />

      <VStack spacing={{ base: 4, xs: 6 }} pt={{ base: 2, sm: 0 }} flex={1}>
        <CustomSkeleton isLoaded={!request.isLoading} flex={1} display="flex">
          {request.data && request.data?.length > 0 ? (
            <VStack
              spacing={{ base: 4, xs: 6 }}
              w="full"
              maxH={{
                base: 'calc($100vh - 301px)',
                xs: 'calc($100vh - 320px)',
                sm: 360,
                md: 380,
              }}
              minH={300}
              flex={1}
              alignSelf="stretch"
              overflowY="scroll"
              sx={{
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
          variant="emptyState"
          onClick={handleAddMoreAPITokens}
          w="full"
          mt="auto"
        >
          Add more API Tokens
        </Button>
      </VStack>
    </TabPanel>
  );
};

export { APITokensList };
