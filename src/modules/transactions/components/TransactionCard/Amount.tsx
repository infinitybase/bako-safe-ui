import { Box, Heading, HStack, Text } from '@chakra-ui/react';

const Amount = () => (
  <HStack>
    <Box mt={0.5}>
      <Heading variant="title-md" color="grey.200">
        1,800 USD
      </Heading>
      <Text variant="description" fontSize="sm" color="grey.500">
        Amount sent
      </Text>
    </Box>
  </HStack>
);

export { Amount };
