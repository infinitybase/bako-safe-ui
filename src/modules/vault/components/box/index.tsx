import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
} from '@chakra-ui/react';

import { ChartBulletIcon, ReplaceIcon } from '@/components';

interface VaultBoxPropx {
  name: string;
  address: string;
  onChangeVault: () => void;
}

const VaultBox = (props: VaultBoxPropx) => {
  const { name, address, onChangeVault } = props;

  return (
    <Box w="100%" mb={12}>
      <HStack width="100%" alignItems="center" spacing={5} mb={5}>
        <Avatar bgColor="dark.150" name={name} />
        <Box w="100%" maxW="100%">
          <Flex alignItems="center" justifyContent="space-between">
            <Heading variant="title-md">{name}</Heading>
            <Box ml={2}>
              <Button
                size="sm"
                variant="link"
                color="brand.500"
                onClick={onChangeVault}
                leftIcon={<ReplaceIcon color="brand.600" />}
              >
                Change vault
              </Button>
            </Box>
          </Flex>
          <Box mt={1}>
            <Text variant="description">{address}</Text>
          </Box>
        </Box>
      </HStack>
      <Box w="100%">
        <Button
          w="100%"
          variant="primary"
          fontWeight="bold"
          leftIcon={<ChartBulletIcon mr={2} fontSize={22} />}
        >
          Create transaction
        </Button>
      </Box>
    </Box>
  );
};

export { VaultBox };
