import { Box, Card, Heading, Text } from '@chakra-ui/react';

import { NotFoundIcon } from '@/components';

const NotificationsEmptyState = () => {
  return (
    <Box pt={8} h={'100%'}>
      <Card
        w="full"
        h={'100%'}
        p={20}
        bgColor="dark.300"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <Box mb={6}>
          <NotFoundIcon w={100} h={100} />
        </Box>

        <Box mb={5}>
          <Heading color="brand.500" fontSize="4xl" textAlign={'center'}>
            Anything to show here.
          </Heading>
        </Box>

        <Box maxW={400} mb={8}>
          <Text
            color="white"
            fontSize="md"
            textAlign="center"
            fontWeight="bold"
          >
            {`You don't have any notifications yet, but we'll let you know as soon
          as there are updates.`}
          </Text>
        </Box>
      </Card>
    </Box>
  );
};

export { NotificationsEmptyState };
