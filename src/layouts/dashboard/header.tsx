import { useFuel } from '@fuels/react';
import { useIsFetching } from '@tanstack/react-query';
import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  Image,
  Loader,
  MenuOpenChangeDetails,
  Popover,
  Separator,
  Skeleton,
  Text,
  VStack,
} from 'bako-ui';
import { AddressUtils as BakoAddressUtils, TypeUser } from 'bakosafe';
import { Address, Network } from 'fuels';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '@/assets/bakoLogoWhite.svg';
import { AddressWithCopyBtn, NotificationIcon } from '@/components';
import { AddressBook2Icon } from '@/components/icons/address-book-2';
import { DisconnectIcon } from '@/components/icons/disconnect';
import { FeedbackIcon } from '@/components/icons/feedback';
import { SettingsTopMenuIcon } from '@/components/icons/settings-top-menu';
import { invalidateQueriesOnNetworkSwitch } from '@/modules/core/utils/react-query';
import {
  IDefaultMessage,
  Pages,
  SocketEvents,
  useEvm,
  useUserWorkspacesRequest,
} from '@/modules';
import { useNetworkSwitch } from '@/modules/network/providers/NetworkSwitchProvider';
import { useBakoIdAvatar } from '@/modules/core/hooks/bako-id';
import { EConnectors } from '@/modules/core/hooks/fuel/useListConnectors';
import { useSocketEvent } from '@/modules/core/hooks/socket/useSocketEvent';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { AddressUtils } from '@/modules/core/utils/address';
import { NetworkDialog } from '@/modules/network/components/dialog';
import { NetworkDrawer } from '@/modules/network/components/drawer';
import { useNetworks } from '@/modules/network/hooks';
import { useNotification } from '@/modules/notification';
import { NotificationsDrawer } from '@/modules/notifications/components';
import { useAppNotifications } from '@/modules/notifications/hooks';
import { SettingsDrawer } from '@/modules/settings/components/drawer';
import { useMySettingsRequest } from '@/modules/settings/hooks/useMySettingsRequest';
import { SelectWorkspaceDialog } from '@/modules/workspace/components';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { limitCharacters } from '@/utils';
import { formatAddressByUserType } from '@/utils/format-address-by-user-type';

import NetworkSelect from './network';

const UserBox = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { authDetails } = useWorkspaceContext();
  const { currentNetwork } = useNetworks();
  const {
    isSwitchingNetwork,
    startNetworkSwitch,
    finishNetworkSwitch,
  } = useNetworkSwitch();
  const networkDrawerState = useDisclosure();
  const networkDialogState = useDisclosure();
  const toast = useNotification();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { fuel } = useFuel();
  const { disconnect: evmDisconnect } = useEvm();
  const settingsDrawer = useDisclosure();
  const notificationDrawerState = useDisclosure();
  const { unreadCounter, setUnreadCounter } = useAppNotifications();
  const mySettingsRequest = useMySettingsRequest(
    authDetails.userInfos?.address,
  );
  const navigate = useNavigate();
  const isFetching = useIsFetching();
  const hasStartedNetworkSwitch = useRef(false);

  const { avatar, isLoading: isLoadingAvatar } = useBakoIdAvatar(
    authDetails.userInfos?.address,
    currentNetwork.chainId,
  );

  const handleOpenMenuChange = useCallback(
    ({ open }: MenuOpenChangeDetails) => {
      setOpenMenu(open);
    },
    [],
  );

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const name = useMemo(
    () => mySettingsRequest.data?.name ?? '',
    [mySettingsRequest.data?.name],
  );
  const hasNickName = useMemo(
    () => name && !AddressUtils.isValid(name),
    [name],
  );
  // const isWebAuthn =
  //   authDetails.userInfos?.type?.type === TypeUser.WEB_AUTHN ||
  //   authDetails.userInfos?.type?.type === TypeUser.EVM ||
  //   authDetails.userInfos?.type?.type === TypeUser.SOCIAL;

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      authDetails.userInfos?.type.type === TypeUser.FUEL &&
        authDetails.userInfos?.type.name !== EConnectors.FULLET &&
        (await fuel.disconnect());

      authDetails.userInfos?.type.type === TypeUser.EVM &&
        (await evmDisconnect());

      // TODO: Disconnect Fuelet, `fuel.disconnect()` should do that but it doesn't work for fuelet
    } catch (error) {
      // eslint-disable-next-line no-empty
    } finally {
      authDetails.handlers.logout?.();
    }
  }, [authDetails, evmDisconnect, fuel]);

  const feedbackForm = useCallback(
    () => window.open(import.meta.env.VITE_FEEDBACK_FORM, '_BLANK'),
    [],
  );

  // Bug fix to unread counter that keeps previous state after redirect
  useEffect(() => {
    setUnreadCounter(0);
    setUnreadCounter(unreadCounter);
  }, []);

  // Finish network switch when all queries are done fetching
  useEffect(() => {
    if (hasStartedNetworkSwitch.current && isSwitchingNetwork && isFetching === 0) {
      finishNetworkSwitch();
      hasStartedNetworkSwitch.current = false;
    }
  }, [isFetching, isSwitchingNetwork, finishNetworkSwitch]);

  useSocketEvent<IDefaultMessage<Network>>(SocketEvents.SWITCH_NETWORK, [
    (message) => {
      if (message.type === SocketEvents.SWITCH_NETWORK) {
        // Start network switch loading state
        hasStartedNetworkSwitch.current = true;
        startNetworkSwitch();

        // Smart invalidation: preserves immutable data while invalidating network-dependent queries
        invalidateQueriesOnNetworkSwitch();
      }
    },
  ]);

  const getUserAddress = useCallback(() => {
    // Return empty string if userInfos is undefined
    if (!authDetails.userInfos) {
      return '';
    }

    if (authDetails.userInfos?.type.type === TypeUser.EVM) {
      return BakoAddressUtils.parseFuelAddressToEth(
        authDetails.userInfos?.address,
      );
    }

    return (
      authDetails.userInfos?.address &&
      Address.fromString(authDetails.userInfos?.address).toB256()
    );
  }, [authDetails.userInfos]);

  const b256UserAddress = useMemo(() => getUserAddress(), [getUserAddress]);

  const handleNotificationClick = useCallback(() => {
    notificationDrawerState.onOpen();
    handleCloseMenu();
  }, [handleCloseMenu, notificationDrawerState]);

  const handleSettingsClick = useCallback(() => {
    settingsDrawer.onOpen();
    handleCloseMenu();
  }, [handleCloseMenu, settingsDrawer]);

  const handleGoToAddressBookPage = useCallback(() => {
    navigate(
      Pages.addressBook({ workspaceId: authDetails?.userInfos?.workspace?.id }),
    );
    handleCloseMenu();
  }, [navigate, authDetails?.userInfos?.workspace?.id, handleCloseMenu]);

  return (
    <>
      <SettingsDrawer
        open={settingsDrawer.isOpen}
        onOpenChange={settingsDrawer.onOpenChange}
        onOpen={settingsDrawer.onOpen}
      />
      <NotificationsDrawer
        open={notificationDrawerState.isOpen}
        onOpenChange={notificationDrawerState.onOpenChange}
      />
      <NetworkDrawer
        open={networkDrawerState.isOpen}
        onOpenChange={networkDrawerState.onOpenChange}
      />
      <NetworkDialog
        open={networkDialogState.isOpen}
        onOpenChange={networkDialogState.onOpenChange}
      />

      {/* TOP MENU */}
      <Popover.Root
        open={openMenu}
        onOpenChange={handleOpenMenuChange}
        positioning={{ placement: 'bottom-end' }}
        autoFocus={false}
      >
        <Popover.Trigger asChild>
          <HStack
            alignItems="center"
            cursor="pointer"
            gap={2}
            p={2}
            bg="bg.muted"
            position="relative"
            borderRadius="lg"
          >
            <Text color="textPrimary" fontSize="xs" lineClamp={1}>
              {hasNickName
                ? limitCharacters(name, 16)
                : AddressUtils.format(b256UserAddress, 4)}
            </Text>

            <Skeleton boxSize="16px" loading={isLoadingAvatar}>
              <Avatar
                boxSize="16px"
                shape="full"
                src={avatar!}
                color="textPrimary"
              />
            </Skeleton>

            {unreadCounter > 0 && (
              <Box
                rounded="full"
                bgColor="red.100"
                boxSize="8px"
                position="absolute"
                top={-1}
                right={-1}
              />
            )}
          </HStack>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Content bg="bg.muted" rounded="2xl">
              <Popover.Body p={0}>
                <VStack cursor="pointer" alignItems="start" p={4} gap={4}>
                  {hasNickName && (
                    <Text color="textPrimary" fontWeight={500}>
                      {limitCharacters(name, 25)}
                    </Text>
                  )}
                  <AddressWithCopyBtn
                    value={
                      authDetails.userInfos?.address &&
                      authDetails.userInfos?.type?.type
                        ? formatAddressByUserType(
                            authDetails.userInfos.address,
                            authDetails.userInfos.type.type,
                          )
                        : (authDetails.userInfos?.address ?? '')
                    }
                    justifyContent="start"
                    gap={4}
                    aria-label="Copy address"
                    isSidebarAddress
                    flexDir="row-reverse"
                    textProps={{
                      color: hasNickName ? 'grey.400' : 'textPrimary',
                    }}
                    onClick={() => {
                      if (
                        authDetails.userInfos.type.type === TypeUser.EVM ||
                        authDetails.userInfos.type.type ===
                          TypeUser.WEB_AUTHN ||
                        authDetails.userInfos.type.type === TypeUser.SOCIAL
                      ) {
                        toast({
                          duration: 3000,
                          isClosable: false,
                          title: 'Copied!',
                          status: 'warning',
                          description:
                            'This is your login account, DO NOT send assets to this address.',
                        });
                        return;
                      }
                    }}
                  />
                </VStack>

                <Separator borderColor="gray.550" w="full" />

                {/* NOTIFICATIONS */}
                <VStack
                  cursor="pointer"
                  alignItems="start"
                  justifyContent="center"
                  px={4}
                  h="70px"
                  onClick={handleNotificationClick}
                >
                  <HStack gap={4} w="full">
                    <Icon
                      color="textPrimary"
                      as={NotificationIcon}
                      w={4}
                      h={4}
                    />
                    <Text color="textPrimary" fontSize="xs">
                      Notifications
                    </Text>
                    {unreadCounter > 0 && (
                      <Text
                        fontSize="2xs"
                        rounded="full"
                        ml="auto"
                        bgColor="red"
                        color="gray.50"
                        fontWeight="bold"
                        border="none"
                        minW="16px"
                        h="16px"
                        lineHeight="shorter"
                        textAlign="center"
                        px={unreadCounter > 99 ? '0.5' : '0'}
                      >
                        {unreadCounter > 99 ? '+99' : unreadCounter}
                      </Text>
                    )}
                  </HStack>
                </VStack>

                <Separator borderColor="gray.550" w="full" />

                {/* NETWORK */}
                <VStack
                  cursor="pointer"
                  alignItems="start"
                  justifyContent="center"
                  px={4}
                  h="70px"
                >
                  <NetworkSelect
                    onCreateNetwork={networkDialogState.onOpen}
                    onSelectNetwork={handleCloseMenu}
                  />
                </VStack>

                <Separator borderColor="gray.550" w="full" />

                <VStack
                  cursor="pointer"
                  alignItems="start"
                  justifyContent="center"
                  px={4}
                  onClick={handleGoToAddressBookPage}
                  h="70px"
                >
                  <HStack gap={4}>
                    <Icon
                      w={4}
                      h={4}
                      color="textPrimary"
                      as={AddressBook2Icon}
                    />
                    <Text color="textPrimary" fontSize="xs">
                      Address Book
                    </Text>
                  </HStack>
                </VStack>

                <Separator borderColor="gray.550" w="full" />

                <VStack
                  cursor="pointer"
                  alignItems="start"
                  justifyContent="center"
                  px={4}
                  h="70px"
                  onClick={handleSettingsClick}
                >
                  <HStack gap={4}>
                    <Icon
                      color="textPrimary"
                      w={4}
                      h={4}
                      as={SettingsTopMenuIcon}
                    />
                    <Text color="textPrimary" fontSize="xs">
                      Settings
                    </Text>
                  </HStack>
                </VStack>

                <Separator borderColor="gray.550" w="full" />

                <VStack
                  cursor="pointer"
                  alignItems="start"
                  justifyContent="center"
                  px={4}
                  onClick={feedbackForm}
                  h="70px"
                >
                  <HStack gap={4}>
                    <Icon w={4} h={4} color="textPrimary" as={FeedbackIcon} />
                    <Text color="textPrimary" fontSize="xs">
                      Send feedback
                    </Text>
                  </HStack>
                </VStack>

                <Separator borderColor="gray.550" w="full" />

                <VStack
                  cursor="pointer"
                  alignItems="start"
                  justifyContent="center"
                  onClick={logout}
                  aria-label="Disconnect"
                  px={4}
                  h="70px"
                >
                  <HStack gap={4} w="full">
                    <Icon color="textPrimary" w={4} as={DisconnectIcon} />
                    <Text color="textPrimary" fontSize="xs">
                      Disconnect
                    </Text>
                    {isLoggingOut && (
                      <Loader
                        ml="auto"
                        borderWidth="3px"
                        animationDelay="0.5s"
                        css={{ '--spinner-track-color': 'colors.yellow.100' }}
                        w="20px"
                        h="20px"
                      />
                    )}
                  </HStack>
                </VStack>
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
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
      h="107px"
      zIndex={100}
      w="100%"
      background="linear-gradient(0deg, rgba(13, 13, 12, 0) 0%, rgba(13, 13, 12, 0.6) 35%, #0D0D0C 90%)"
      px={{
        base: 3,
        sm: 6,
      }}
      style={{ WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)' }}
      alignItems="center"
      position="sticky"
      top="0"
      justifyContent="space-between"
    >
      <NotificationsDrawer
        open={notificationDrawerState.isOpen}
        onOpenChange={notificationDrawerState.onOpenChange}
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
      <Box
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <UserBox />
      </Box>
    </Flex>
  );
};

export { Header, UserBox };
