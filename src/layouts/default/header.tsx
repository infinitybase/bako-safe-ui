import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { useFuel } from '@fuels/react';
import { useState } from 'react';
import {
  MdEdit as EditIcon,
  MdExitToApp as ExitIcon,
  MdPeople as PeopleIcon,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import logo from '@/assets/logo.svg';
import { Pages } from '@/modules/core';
import { TabEnum } from './types';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const Header = () => {
  const [tab, setTab] = useState<TabEnum>(TabEnum.VAULTS);
  const navigate = useNavigate();

  const { fuel } = useFuel();
  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { goHome },
    },
  } = useWorkspaceContext();

  const isSignatureTab = tab === TabEnum.SIGNATURES;

  const disconnect = async () => {
    await fuel.disconnect();
    navigate(Pages.index());
  };

  return (
    <Flex
      pt={3}
      width="100%"
      justifyContent="space-between"
      alignItems="center"
    >
      <Flex maxWidth={60} flex={1}>
        <img width={40} src={logo} alt="" />
      </Flex>

      <Flex justifyContent="center" alignItems="center" flex={4}>
        <Flex padding={1} bg="dark.500" borderRadius="27px">
          <Flex
            py={2}
            px={5}
            bg={!isSignatureTab ? 'dark.100' : undefined}
            borderRadius={!isSignatureTab ? '27px' : undefined}
            cursor="pointer"
            onClick={() => {
              setTab(TabEnum.VAULTS);
              goHome();
            }}
          >
            <Flex mr={2} alignItems="center">
              <Icon
                as={EditIcon}
                fontSize="md"
                color={!isSignatureTab ? 'brand.500' : 'gray'}
              />
            </Flex>
            <Flex alignItems="center">
              <Text fontSize="xs" color={!isSignatureTab ? 'white' : 'gray'}>
                Predicate
              </Text>
            </Flex>
          </Flex>
          <Flex
            py={2}
            px={5}
            bg={isSignatureTab ? 'dark.100' : undefined}
            borderRadius={isSignatureTab ? '27px' : undefined}
            cursor="pointer"
            onClick={() => {
              setTab(TabEnum.SIGNATURES);
              navigate(Pages.signatures());
            }}
          >
            <Flex mr={2} alignItems="center">
              <Icon
                as={PeopleIcon}
                fontSize="md"
                color={isSignatureTab ? 'brand.500' : 'gray'}
              />
            </Flex>
            <Flex alignItems="center">
              <Text fontSize="xs" color={isSignatureTab ? 'white' : 'gray'}>
                Signature
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Flex alignItems="center" flex={1}>
        <Flex padding={1} bg="dark.500" borderRadius="27px">
          <Flex py={2} px={5} bg="dark.100" borderRadius="27px">
            <Box mr={4}>
              <Text fontSize="xs" color="gray">
                {String(userInfos.address).slice(0, 4)}...
                {String(userInfos.address).slice(-4)}
              </Text>
            </Box>
            <Flex alignItems="center" onClick={disconnect}>
              <Icon as={ExitIcon} fontSize="md" color="gray" />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export { Header };
