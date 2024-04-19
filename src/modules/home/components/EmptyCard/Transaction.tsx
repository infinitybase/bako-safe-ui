import { Box, Card, Heading, Text } from '@chakra-ui/react';

import { NotFoundIcon } from '@/components';

const EmptyTransaction = () => {
  return (
    <Card
      w="full"
      mt={{ base: 0, sm: 2 }}
      p={{ base: 10, sm: 16 }}
      bgColor="grey.850"
      display="flex"
      borderWidth={2}
      borderColor="grey.300"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      <Box mb={6}>
        <NotFoundIcon w={120} h={170} />
      </Box>
      <Box mb={5}>
        <Heading
          color="white"
          textAlign="center"
          fontSize={{ base: '2xl', sm: '4xl' }}
        >
          Nothing to show here.
        </Heading>
      </Box>
      <Box maxW={400} mb={8}>
        <Text
          color="grey.450"
          fontSize={{ base: 'sm', sm: 'md' }}
          textAlign="center"
          fontWeight="medium"
        >
          It seems like you {"haven't"} made any <br /> transactions yet.
        </Text>
      </Box>
    </Card>
  );
};

export { EmptyTransaction };
