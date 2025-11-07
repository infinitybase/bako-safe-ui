import { Box, Flex, Stack, Text } from 'bako-ui';
import { Link, useParams } from 'react-router-dom';

import { useGetWidgetUrl } from '@/modules/vault/hooks';

export const VaultBuySellSessionPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data, error } = useGetWidgetUrl(sessionId ?? '');

  return (
    <Flex w="full" direction="column">
      <Box w="full" flex={1} display="flex">
        {data?.widgetUrl && (
          <iframe
            src={data.widgetUrl}
            style={{ flex: 1, borderRadius: '4px' }}
            width="100%"
            height="100%"
            title="Buy & Sell Session"
          />
        )}
        {error && (
          <Stack w="full" alignItems="center" justifyContent="center" mt={8}>
            <Text color="red.500" fontSize="md">
              An error occurred while getting the widget URL. Please try again
              later.
            </Text>
            <Link to={'../'}>Back</Link>
          </Stack>
        )}
      </Box>
    </Flex>
  );
};
