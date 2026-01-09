import { Box, Card, Heading, Text } from 'bako-ui';
import { EmptyIcon } from '@/components';

const NotificationsEmptyState = () => {
  return (
    <Box h={'100%'} borderRadius={10} borderWidth={1} borderColor="gray.400">
      <Card.Root
        w="full"
        h={'100%'}
        p={[10, 14]}
        bgColor="transparent"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <Box mb={4}>
          <EmptyIcon width="60px" height="60px" />
        </Box>

        <Box mb={4}>
          <Heading
            color="textPrimary"
            fontSize="lg"
            textAlign="center"
            fontWeight={600}
          >
            Nothing to show here.
          </Heading>
        </Box>

        <Box>
          <Text
            color="textSecondary"
            fontSize="xs"
            textAlign="center"
            fontWeight={200}
            lineHeight={1.4}
          >
            {`You don't have any notifications yet. We will notify you as soon as a notification arrives.`}
          </Text>
        </Box>
      </Card.Root>
    </Box>
  );
};

export { NotificationsEmptyState };
