import { Avatar, Box, Heading, HStack, Text } from '@chakra-ui/react';

import { limitCharacters } from '@/utils';

interface TransactionVaultInfoProps {
  name: string;
  description?: string;
}

const VaultInfo = ({ name, description }: TransactionVaultInfoProps) => (
  <HStack>
    <Avatar
      variant="roundedSquare"
      name="Vault Name"
      color="white"
      bg="grey.900"
      w="38px"
      h="38px"
      fontSize="small"
    />
    <Box>
      <Heading variant="title-md" color="grey.200">
        {name}
      </Heading>
      {description && (
        <Text variant="description" fontSize="sm" color="grey.500">
          {limitCharacters(description, 20)}
        </Text>
      )}
    </Box>
  </HStack>
);

export { VaultInfo };
