import { Box, Heading, HStack, Text } from '@chakra-ui/react';

const Name = () => (
  <HStack>
    <Box>
      <Heading variant="title-md" color="grey.200">
        Fuel annual perk
      </Heading>
      <Text variant="description" fontSize="sm" color="grey.500">
        Transaction
      </Text>
    </Box>
  </HStack>
);

export { Name };
