import {
  Avatar,
  Badge,
  Box,
  Button,
  chakra,
  Heading,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { FaRegClone } from 'react-icons/fa';
import { HiQrCode } from 'react-icons/hi2';

import avatar from '@/assets/avatars/avatar-1.png';
import { ChartBulletIcon, PendingIcon } from '@/components';

const MenuList = chakra(VStack);
const MenuItem = chakra(HStack, {
  baseStyle: {
    w: '100%',
    justifyContent: 'flex-start',
  },
  shouldForwardProp: () => true,
});

/* TODO: create props with data vault and move to vault module */
const VaultBox = () => {
  return (
    <Box w="100%" mb={12}>
      <HStack width="100%" alignItems="flex-start" spacing={5} mb={5}>
        <Box>
          <Avatar name="Infinity" src={avatar} />
        </Box>
        <Box>
          <Heading variant="title-md">Infinitybase</Heading>
          <Box my={1}>
            <Text variant="description">
              <Text variant="description" fontWeight="bold" as="span">
                Eth:{' '}
              </Text>
              0xf3f0e...6ce3
            </Text>
          </Box>
          <Text variant="subtitle" fontSize="sm">
            12,492.98 USD
          </Text>
        </Box>
      </HStack>
      <HStack justifyContent="center" spacing={2} mb={5}>
        <IconButton
          aria-label="Copy"
          variant="icon"
          icon={<Icon as={FaRegClone} />}
        />
        <IconButton
          aria-label="QR Code"
          variant="icon"
          icon={<Icon as={HiQrCode} />}
        />
        <IconButton
          aria-label="Show in explorer"
          variant="icon"
          icon={<Icon as={BsBoxArrowUpRight} />}
        />
      </HStack>
      <Box w="100%">
        <Button
          w="100%"
          variant="primary"
          fontWeight="bold"
          leftIcon={<ChartBulletIcon />}
        >
          Create New Vault
        </Button>
      </Box>
    </Box>
  );
};

const Sidebar = () => {
  return (
    <Box
      bgColor="dark.500"
      borderRightWidth={1}
      borderRightColor="dark.100"
      py={6}
      px={6}
    >
      <VaultBox />
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
