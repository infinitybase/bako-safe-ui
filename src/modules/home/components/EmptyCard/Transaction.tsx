import { Box, Card, Heading, Text } from '@chakra-ui/react';

import { NotFoundIcon } from '@/components';

const EmptyTransaction = () => {
  return (
    <Card
      w="full"
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
        <Heading color="brand.500" fontSize="4xl">
          Nothing to show here.
        </Heading>
      </Box>
      <Box maxW={400} mb={8}>
        <Text color="white" fontSize="md" textAlign="center" fontWeight="bold">
          It seems like you {"haven't"} made any <br /> transactions yet.
        </Text>
      </Box>
    </Card>
  );
};

export { EmptyTransaction };
