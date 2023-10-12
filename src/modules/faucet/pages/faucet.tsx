import { PlusSquareIcon } from '@chakra-ui/icons';
import { Box, Button, Card, Heading, Text } from '@chakra-ui/react';

import { NotFoundIcon } from '@/components';

const FaucetPage = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" h="100vh">
      <Card
        w="full"
        maxW={{ base: 'xs', md: 'md' }}
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
            {"Let's"} Begin!
          </Heading>
        </Box>
        <Box maxW={400} mb={8}>
          <Text
            color="white"
            fontSize="md"
            textAlign="center"
            fontWeight="bold"
          >
            You {"don't"} have any vaults. {"Let's"} create your very first one?
          </Text>
        </Box>
        <Button
          leftIcon={<PlusSquareIcon />}
          variant="primary"
          //onClick={mint}
        >
          Create my first vault
        </Button>
      </Card>
    </Box>
  );
};

export { FaucetPage };
