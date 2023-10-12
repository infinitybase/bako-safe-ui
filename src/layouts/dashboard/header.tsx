import {
  Avatar,
  Box,
  chakra,
  Flex,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';

import logo from '@/assets/logo.svg';
import { ArrowDownIcon, NotificationIcon, QuestionIcon } from '@/components';
import { useFuelAccount } from '@/modules';

const SpacedBox = chakra(Box, {
  baseStyle: {
    paddingX: 6,
    paddingY: 3,
  },
});

const TopBarItem = chakra(SpacedBox, {
  baseStyle: {
    borderLeftWidth: 1,
    borderColor: 'dark.100',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});

/* TODO: create props with data user */
const UserBox = () => {
  const { formattedAccount, avatar } = useFuelAccount();
  return (
    <Flex w="100%" display="flex" alignItems="center">
      <Box mr={4}>
        <Avatar name={formattedAccount} src={avatar} />
      </Box>
      <Box mr={9}>
        <Text variant="description">{formattedAccount}</Text>
      </Box>
      <Box hidden={true}>
        <Icon color="grey.200" as={ArrowDownIcon} />
      </Box>
    </Flex>
  );
};

const Header = () => {
  return (
    <Flex
      w="100%"
      h={82}
      alignItems="center"
      justifyContent="space-between"
      bgColor="dark.300"
      borderBottomWidth={1}
      borderBottomColor="dark.100"
    >
      <SpacedBox>
        <img width={90} src={logo} alt="" />
      </SpacedBox>

      <HStack spacing={0} height="100%">
        <TopBarItem>
          <Icon color="grey.200" as={QuestionIcon} />
        </TopBarItem>
        <TopBarItem>
          <Icon color="grey.200" as={NotificationIcon} />
        </TopBarItem>
        <TopBarItem>
          <UserBox />
        </TopBarItem>
      </HStack>
    </Flex>
  );
};

export { Header };
