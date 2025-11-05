import { WarningTwoIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  chakra,
  Flex,
  HStack,
  Icon,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useFuel } from '@fuels/react';
import { usePrivy } from '@privy-io/react-auth';
import { AddressUtils as BakoAddressUtils } from 'bakosafe';
import { Address, Network } from 'fuels';
import React, { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

import logo from '@/assets/bakoLogoWhite.svg';
import {
  AddressWithCopyBtn,
  NotificationIcon,
  PlusIcon,
  UnknownIcon,
} from '@/components';
import { BakoIcon } from '@/components/icons/assets/bakoIcon';
import { DisconnectIcon } from '@/components/icons/disconnect';
import { FeedbackIcon } from '@/components/icons/feedback';
import { NetworkIcon } from '@/components/icons/network';
import { SettingsTopMenuIcon } from '@/components/icons/settings-top-menu';
import { queryClient } from '@/config';
import {
  IDefaultMessage,
  SocketEvents,
  useEvm,
  useUserWorkspacesRequest,
} from '@/modules';
import { TypeUser } from '@/modules/auth/services';
import { useBakoIdAvatar } from '@/modules/core/hooks/bako-id';
import { EConnectors } from '@/modules/core/hooks/fuel/useListConnectors';
import { useSocketEvent } from '@/modules/core/hooks/socket/useSocketEvent';
import { AddressUtils } from '@/modules/core/utils/address';
import { NetworkDialog } from '@/modules/network/components/dialog';
import { NetworkDrawer } from '@/modules/network/components/drawer';
import { useNetworks } from '@/modules/network/hooks';
import { NetworkService, NetworkType } from '@/modules/network/services';
import { useNotification } from '@/modules/notification';
import { NotificationsDrawer } from '@/modules/notifications/components';
import { useAppNotifications } from '@/modules/notifications/hooks';
import { SettingsDrawer } from '@/modules/settings/components/drawer';
import { useMySettingsRequest } from '@/modules/settings/hooks/useMySettingsRequest';
import { SelectWorkspaceDialog } from '@/modules/workspace/components';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { limitCharacters } from '@/utils';

const SpacedBox = chakra(Box, {
  baseStyle: {
    paddingX: {
      base: 3,
      sm: 6,
    },
    paddingY: 3,
  },
});

const TopBarItem = chakra(SpacedBox, {
  baseStyle: {
    borderColor: 'dark.100',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '35%',
  },
});

const UserBox = () => {
  const {
    authDetails,
    screenSizes: {
      isMobile,
      isExtraSmall,
      isLitteSmall,
      isLowerThanFourHundredAndThirty,
    },
  } = useWorkspaceContext();

  const {
    networks,
    currentNetwork,
    handleSelectNetwork,
    selectNetworkRequest,
    checkNetwork,
  } = useNetworks();
  const networkPopoverState = useDisclosure();
  const networkDrawerState = useDisclosure();
  const networkDialogState = useDisclosure();
  const toast = useNotification();

  const { fuel } = useFuel();
  const { disconnect: evmDisconnect } = useEvm();
  const { logout: privyLogout } = usePrivy();
  const settingsDrawer = useDisclosure();
  const notificationDrawerState = useDisclosure();
  const { unreadCounter, setUnreadCounter } = useAppNotifications();
  const mySettingsRequest = useMySettingsRequest(
    authDetails.userInfos?.address,
  );

  const { avatar, isLoading: isLoadingAvatar } = useBakoIdAvatar(
    authDetails.userInfos?.address,
    currentNetwork.chainId,
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openAlert, setOpenAlert] = React.useState(false);

  const name = mySettingsRequest.data?.name ?? '';
  const hasNickName = name && !AddressUtils.isValid(name);

  const isWebAuthn =
    authDetails.userInfos?.type?.type === TypeUser.WEB_AUTHN ||
    authDetails.userInfos?.type?.type === TypeUser.EVM ||
    authDetails.userInfos?.type?.type === TypeUser.SOCIAL;

  const isMainnet = (url: string) => url?.includes(NetworkType.MAINNET);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logout = async () => {
    setIsLoggingOut(true);
    try {
      authDetails.userInfos?.type.type === TypeUser.FUEL &&
        authDetails.userInfos?.type.name !== EConnectors.FULLET &&
        (await fuel.disconnect());

      authDetails.userInfos?.type.type === TypeUser.EVM &&
        (await evmDisconnect());

      authDetails.userInfos?.type.type === TypeUser.SOCIAL &&
        (await privyLogout());

      // TODO: Disconnect Fuelet, `fuel.disconnect()` should do that but it doesn't work for fuelet
    } catch (error) {
      // eslint-disable-next-line no-empty
    } finally {
      authDetails.handlers.logout?.();
    }
  };

  const feedbackForm = () =>
    window.open(import.meta.env.VITE_FEEDBACK_FORM, '_BLANK');

  // Bug fix to unread counter that keeps previous state after redirect
  useEffect(() => {
    setUnreadCounter(0);
    setUnreadCounter(unreadCounter);
  }, []);

  useSocketEvent<IDefaultMessage<Network>>(SocketEvents.SWITCH_NETWORK, [
    (message) => {
      if (message.type === SocketEvents.SWITCH_NETWORK) {
        queryClient.invalidateQueries();
      }
    },
  ]);

  const getUserAddress = () => {
    if (authDetails.userInfos?.type.type === TypeUser.EVM) {
      return BakoAddressUtils.parseFuelAddressToEth(
        authDetails.userInfos?.address,
      );
    }

    return (
      authDetails.userInfos?.address &&
      Address.fromString(authDetails.userInfos?.address).toB256()
    );
  };

  const b256UserAddress = getUserAddress();

  return (
    <>
      <SettingsDrawer
        isOpen={settingsDrawer.isOpen}
        onClose={settingsDrawer.onClose}
        onOpen={settingsDrawer.onOpen}
      />
      <NotificationsDrawer
        isOpen={notificationDrawerState.isOpen}
        onClose={notificationDrawerState.onClose}
      />
      <NetworkDrawer
        isOpen={networkDrawerState.isOpen}
        onClose={networkDrawerState.onClose}
      />
      <NetworkDialog
        isOpen={networkDialogState.isOpen}
        onClose={networkDialogState.onClose}
      />

      {!isMobile && (
        <Popover
          isOpen={isWebAuthn && networkPopoverState.isOpen}
          onClose={networkPopoverState.onClose}
        >
          <PopoverTrigger>
            <HStack
              w={220}
              h={'32px'}
              alignItems="center"
              cursor={isWebAuthn ? 'pointer' : 'default'}
              onClick={networkPopoverState.onOpen}
              aria-label={'Select networks'}
              spacing={isMobile ? 2 : 4}
              position="relative"
              border={'1px solid'}
              borderColor="grey.925"
              justifyContent={
                selectNetworkRequest.isPending ? 'center' : 'space-between'
              }
              borderRadius="6px"
              py={2}
              px={4}
              mr={6}
            >
              {selectNetworkRequest.isPending ? (
                <Spinner w={4} h={4} color="brand.500" />
              ) : (
                <>
                  <HStack>
                    <Icon
                      as={
                        checkNetwork(NetworkType.MAINNET)
                          ? BakoIcon
                          : UnknownIcon
                      }
                      fontSize={16}
                    />

                    <Text
                      fontSize={12}
                      fontWeight={500}
                      color="grey.200"
                      noOfLines={1}
                    >
                      {NetworkService.getName(currentNetwork.url)}
                    </Text>
                  </HStack>

                  {isWebAuthn && (
                    <Icon
                      color="grey.200"
                      fontSize={{ base: 'sm', sm: 'sm' }}
                      as={FaChevronDown}
                    />
                  )}
                </>
              )}
            </HStack>
          </PopoverTrigger>

          <PopoverContent
            bg={'dark.300'}
            w={220}
            borderTop="none"
            border="1px solid #353230"
            _focus={{ ring: 'none' }}
          >
            <PopoverBody p={0}>
              <VStack cursor={'pointer'} alignItems="start" spacing={0}>
                {networks?.map((network) => (
                  <VStack
                    w="full"
                    key={network.url}
                    cursor={'pointer'}
                    alignItems="start"
                    justifyContent="center"
                    borderBottom={'1px solid'}
                    borderColor="grey.925"
                    px={4}
                    py={4}
                    onClick={() => {
                      networkPopoverState.onClose?.();
                      if (network.url !== currentNetwork.url) {
                        handleSelectNetwork(network.url);
                      }
                    }}
                  >
                    <HStack>
                      <Icon
                        as={isMainnet(network.url) ? BakoIcon : UnknownIcon}
                        fontSize={16}
                      />
                      <Text color="grey.200" fontSize={12} fontWeight={500}>
                        {network.name}
                      </Text>
                    </HStack>
                  </VStack>
                ))}

                <VStack
                  w="full"
                  cursor={'pointer'}
                  alignItems="start"
                  justifyContent="center"
                  borderBottom={'1px solid'}
                  borderColor="grey.925"
                  px={4}
                  py={4}
                  onClick={() => networkDialogState.onOpen()}
                >
                  <HStack>
                    <Icon as={PlusIcon} fontSize={16} color="grey.75" />
                    <Text color="grey.200" fontSize={12} fontWeight={500}>
                      Add new network
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}

      {/* TOP MENU */}
      <Popover placement="bottom-end">
        <PopoverTrigger>
          <HStack
            // w="100%"
            alignItems="center"
            cursor={'pointer'}
            spacing={isMobile ? 2 : 4}
            position="relative"
            border={isMobile ? '1px solid #353230' : 'none'}
            borderRadius="6px"
          >
            <HStack
              w="full"
              flexDir={isMobile ? 'row' : 'row-reverse'}
              spacing={4}
            >
              <Text
                fontWeight="semibold"
                color="grey.200"
                pl={isMobile ? 4 : 0}
                noOfLines={1}
              >
                {hasNickName ? (
                  limitCharacters(name, 20)
                ) : (
                  <AddressWithCopyBtn
                    value={authDetails.userInfos?.address ?? ''}
                    customValue={AddressUtils.format(
                      b256UserAddress,
                      isExtraSmall
                        ? 8
                        : isLitteSmall
                          ? 10
                          : isLowerThanFourHundredAndThirty
                            ? 15
                            : 18,
                    )}
                    justifyContent="start"
                    aria-label="Copy address"
                    flexDir="row-reverse"
                    hideCopyButton
                    textProps={{
                      fontSize: isMobile ? 'xs' : 'md',
                    }}
                  />
                )}
              </Text>

              <Skeleton
                boxSize={isMobile ? '32px' : '40px'}
                isLoaded={!isLoadingAvatar}
              >
                <Avatar
                  variant="roundedSquare"
                  src={avatar || authDetails.userInfos?.avatar}
                  boxSize="full"
                  border={avatar ? 'none' : '1px solid #CFCCC9'}
                />
              </Skeleton>

              {!isMobile && (
                <HStack
                  position="relative"
                  mr={3}
                  onClick={notificationDrawerState.onOpen}
                >
                  <Icon color="grey.75" as={NotificationIcon} fontSize="28px" />
                  {unreadCounter > 0 && (
                    <Text
                      fontSize="10px"
                      rounded="full"
                      bgColor="error.600"
                      color="white"
                      border="none"
                      minW="20px"
                      h="20px"
                      lineHeight="18px"
                      textAlign="center"
                      position="absolute"
                      top={-1}
                      right={-1}
                      px={unreadCounter > 99 ? '0.5' : '0'}
                    >
                      {unreadCounter > 99 ? '+99' : unreadCounter}
                    </Text>
                  )}
                </HStack>
              )}
            </HStack>
            {!isMobile && (
              <Icon
                aria-label={'Dropdown header'}
                color="grey.200"
                fontSize={{ base: 'sm', sm: 'lg' }}
                as={FaChevronDown}
              />
            )}

            {unreadCounter > 0 && isMobile && (
              <Text
                fontSize="xs"
                minW="20px"
                h="20px"
                lineHeight="18px"
                rounded="full"
                bgColor="error.600"
                color="white"
                textAlign="center"
                position="absolute"
                right={-2}
                top={-2}
                px={unreadCounter > 99 ? '0.5' : '0'}
              >
                {unreadCounter > 99 ? '+99' : unreadCounter}
              </Text>
            )}
          </HStack>
        </PopoverTrigger>

        <PopoverContent
          bg={'dark.300'}
          // w="100%"
          m={0}
          p={0}
          pb={0}
          borderTop="none"
          border="1px solid #353230"
          _focus={{ ring: 'none' }}
        >
          <PopoverBody pb={0}>
            <VStack
              cursor={'pointer'}
              alignItems="start"
              px={4}
              py={2}
              spacing={1.5}
            >
              {hasNickName && (
                <Text color="grey.50" fontWeight={500}>
                  {limitCharacters(name, 25)}
                </Text>
              )}
              <AddressWithCopyBtn
                value={
                  authDetails.userInfos?.type.type === TypeUser.WEB_AUTHN
                    ? AddressUtils.toBech32(authDetails.userInfos?.address)
                    : (authDetails.userInfos?.address ?? '')
                }
                justifyContent="start"
                aria-label="Copy address"
                isSidebarAddress
                flexDir="row-reverse"
                textProps={{ color: '#AAA6A1' }}
                onClick={() => {
                  if (authDetails.userInfos.type.type === TypeUser.EVM) {
                    toast({
                      position: 'top-right',
                      duration: 3000,
                      isClosable: false,
                      title: 'Copied!',
                      status: 'warning',
                      description:
                        'This is your login account, DO NOT send assets to this address.',
                      icon: (
                        <Icon
                          fontSize="2xl"
                          color="brand.500"
                          as={WarningTwoIcon}
                        />
                      ),
                    });
                    return;
                  }

                  authDetails.userInfos.type.type === TypeUser.WEB_AUTHN &&
                    setOpenAlert(true);
                }}
              />
            </VStack>

            {isMobile && (
              <VStack
                borderTop={'1px solid'}
                borderTopColor={'dark.100'}
                cursor={'pointer'}
                alignItems="start"
                justifyContent="center"
                px={4}
                h="70px"
                onClick={networkDrawerState.onOpen}
              >
                <HStack spacing={4}>
                  <Icon color="grey.75" w={5} h={5} as={NetworkIcon} />
                  <Text color="grey.75" fontWeight={500}>
                    Network
                  </Text>
                </HStack>
              </VStack>
            )}

            {isMobile && (
              <VStack
                borderTop={'1px solid'}
                borderTopColor={'dark.100'}
                cursor={'pointer'}
                alignItems="start"
                justifyContent="center"
                px={4}
                h="70px"
                onClick={notificationDrawerState.onOpen}
              >
                <HStack spacing={4}>
                  <Icon
                    color="grey.75"
                    as={NotificationIcon}
                    fontSize={20}
                    w={5}
                    h={5}
                  />
                  <Text color="grey.75" fontWeight={500}>
                    Notifications
                  </Text>
                  {unreadCounter > 0 && (
                    <Text
                      fontSize="xs"
                      rounded="full"
                      bgColor="error.600"
                      color="white"
                      border="none"
                      minW="20px"
                      h="20px"
                      lineHeight="18px"
                      textAlign="center"
                      px={unreadCounter > 99 ? '0.5' : '0'}
                    >
                      {unreadCounter > 99 ? '+99' : unreadCounter}
                    </Text>
                  )}
                </HStack>
              </VStack>
            )}

            <VStack
              borderTop={'1px solid'}
              borderTopColor={'dark.100'}
              cursor={'pointer'}
              alignItems="start"
              justifyContent="center"
              px={4}
              h="70px"
              onClick={settingsDrawer.onOpen}
            >
              <HStack spacing={4}>
                <Icon color="grey.75" w={5} h={5} as={SettingsTopMenuIcon} />
                <Text color="grey.75" fontWeight={500}>
                  Settings
                </Text>
              </HStack>
            </VStack>

            <VStack
              borderTop={'1px solid'}
              borderTopColor={'dark.100'}
              cursor={'pointer'}
              alignItems="start"
              justifyContent="center"
              px={4}
              h="70px"
            >
              <HStack cursor={'pointer'} onClick={feedbackForm} spacing={4}>
                <Icon
                  w={5}
                  h={5}
                  color="grey.75"
                  fontSize={18}
                  as={FeedbackIcon}
                />
                <Text color="grey.75" fontWeight={500}>
                  Send feedback
                </Text>
              </HStack>
            </VStack>

            <VStack
              borderTop={'1px solid'}
              borderTopColor={'dark.100'}
              cursor={'pointer'}
              alignItems="start"
              justifyContent="center"
              px={4}
              h="70px"
              mb={0}
            >
              <HStack
                cursor="pointer"
                onClick={logout}
                spacing={4}
                aria-label="Disconnect"
                w="full"
              >
                <Icon color="grey.75" fontSize="xl" as={DisconnectIcon} />
                <Text color="grey.75" fontWeight={500}>
                  Disconnect
                </Text>
                <Spacer />
                {isLoggingOut && (
                  <Spinner
                    thickness="3px"
                    speed="0.5s"
                    emptyColor="gray.200"
                    color="brand.500"
                    w="20px"
                    h="20px"
                  />
                )}
              </HStack>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

const Header = () => {
  const notificationDrawerState = useDisclosure();
  const createWorkspaceDialog = useDisclosure();
  const { data: userWorkspaces } = useUserWorkspacesRequest();
  const {
    workspaceInfos: {
      workspaceDialog,
      handlers: { handleWorkspaceSelection, goHome },
    },
  } = useWorkspaceContext();

  const { unreadCounter, setUnreadCounter } = useAppNotifications();

  const handleGoToCreateWorkspace = () => createWorkspaceDialog.onOpen();

  // Bug fix to unread counter that keeps previous state after redirect
  useEffect(() => {
    setUnreadCounter(0);
    setUnreadCounter(unreadCounter);
  }, []);

  return (
    <Flex
      h={{
        base: '64px',
        sm: '72px',
      }}
      zIndex={100}
      w="100%"
      bgColor="dark.950"
      px={{ base: 0, sm: 4 }}
      alignItems="center"
      position="sticky"
      top="0"
      justifyContent="space-between"
      boxShadow="0px 8px 12px 0px rgba(0, 0, 0, 0.2)"
    >
      <NotificationsDrawer
        isOpen={notificationDrawerState.isOpen}
        onClose={notificationDrawerState.onClose}
      />
      <SelectWorkspaceDialog
        dialog={workspaceDialog}
        userWorkspaces={userWorkspaces ?? []}
        onSelect={handleWorkspaceSelection}
        onCreate={handleGoToCreateWorkspace}
        isCreatingWorkspace={createWorkspaceDialog.isOpen}
      />
      <Box
        cursor="pointer"
        onClick={() => {
          goHome();
        }}
      >
        <Image width={{ base: 90, sm: 140 }} src={logo} alt="" p={0} />
      </Box>
      <TopBarItem>
        <UserBox />
      </TopBarItem>
    </Flex>
  );
};

export { Header };
