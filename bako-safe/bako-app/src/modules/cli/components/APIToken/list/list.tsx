import { Button, Divider, TabPanel, VStack } from '@chakra-ui/react';
import { CustomSkeleton, EmptyState } from '@ui/components';

import { TabState, UseAPITokenReturn } from '@/modules/cli/hooks';

import { APITokenCard } from './card';

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
                base: 'calc(100vh - 301px)',
                xs: 'calc(100vh - 320px)',
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
