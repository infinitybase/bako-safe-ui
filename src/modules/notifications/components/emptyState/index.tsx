import { Box, Card, Heading, Text } from '@chakra-ui/react';

import { EmptyBoxOutline } from '@/components';

const NotificationsEmptyState = () => {
  return (
    <Box h={'100%'} borderRadius={10} borderWidth={1} borderColor="grey.800">
      <Card
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
          <EmptyBoxOutline w={100} h={100} />
        </Box>

        <Box mb={4}>
          <Heading
            color="grey.75"
            fontSize="lg"
            textAlign="center"
            fontWeight={600}
          >
            No Data available
          </Heading>
        </Box>

        <Box>
          <Text
            color="grey.250"
            fontSize="xs"
            textAlign="center"
            fontWeight={200}
            lineHeight={1.4}
          >
            {`Currently, there is no available data to display in this section.`}
          </Text>
        </Box>
      </Card>
    </Box>
  );
};

export { NotificationsEmptyState };
