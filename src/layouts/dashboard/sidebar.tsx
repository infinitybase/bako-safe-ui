import {
  Badge,
  Box,
  chakra,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { HiQrCode } from 'react-icons/hi2';

import { PendingIcon } from '@/components';
import { VaultBox } from '@/modules';

const MenuList = chakra(VStack);
const MenuItem = chakra(HStack, {
  baseStyle: {
    w: '100%',
    justifyContent: 'flex-start',
  },
  shouldForwardProp: () => true,
});

const Sidebar = () => {
  return (
    <Box
      w="100%"
      maxW="350px"
      bgColor="dark.500"
      borderRightWidth={1}
      borderRightColor="dark.100"
      py={6}
      px={6}
    >
      <VaultBox
        name="Infinitybase"
        address="0xf3f0eff0e080e...6ce3"
        onChangeVault={() => {
          console.log('Changing vault');
        }}
      />
      <MenuList spacing={6} w="100%">
        <MenuItem spacing={4}>
          <Icon as={HiQrCode} fontSize="xl" />
          <Text variant="subtitle" fontSize="lg">
            Transactions
          </Text>
          <Badge variant="warning">
            <Icon as={PendingIcon} /> 1
          </Badge>
        </MenuItem>
        <MenuItem spacing={4}>
          <Icon as={HiQrCode} fontSize="xl" />
          <Text variant="subtitle" fontSize="lg">
            Address book
          </Text>
        </MenuItem>
        <MenuItem spacing={4}>
          <Icon as={HiQrCode} fontSize="xl" />
          <Text variant="subtitle" fontSize="lg">
            Settings
          </Text>
        </MenuItem>
      </MenuList>
    </Box>
  );
};

export { Sidebar };
