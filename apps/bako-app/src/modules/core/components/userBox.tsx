import { NetworkType } from '@bako-safe/services';
import {
  BakoIcon,
  ChevronDownIcon,
  DisconnectIcon,
  FeedbackIcon,
  NetworkIcon,
  NotificationIcon,
  PlusIcon,
  SettingsTopMenuIcon,
  UnknownIcon,
} from '@bako-safe/ui';
import {
  Avatar,
  HStack,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useFuel } from '@fuels/react';
import { TypeUser } from 'bakosafe';
import { Address } from 'fuels';
import { useEffect } from 'react';

import { networkService } from '@/config/services-initializer';
import { AddressWithCopyBtn } from '@/modules';
import { NetworkDialog } from '@/modules/network/components/dialog';
import { NetworkDrawer } from '@/modules/network/components/drawer';
import { useNetworks } from '@/modules/network/hooks';
import { NotificationsDrawer } from '@/modules/notifications/components';
import { useAppNotifications } from '@/modules/notifications/hooks';
import { SettingsDrawer } from '@/modules/settings/components/drawer';
import { useMySettingsRequest } from '@/modules/settings/hooks/useMySettingsRequest';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { limitCharacters } from '@/utils';

import { AddressUtils } from '../utils';

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

  const { fuel } = useFuel();
  const settingsDrawer = useDisclosure();
  const notificationDrawerState = useDisclosure();
  const { unreadCounter, setUnreadCounter } = useAppNotifications();
  const mySettingsRequest = useMySettingsRequest(
    authDetails.userInfos?.address,
  );

  const name = mySettingsRequest.data?.name ?? '';
  const hasNickName = name && !AddressUtils.isValid(name);

  const isWebAuthn = authDetails.userInfos?.type === TypeUser.WEB_AUTHN;

  const isMainnet = (url: string) => url?.includes(NetworkType.MAINNET);

  const logout = async () => {
    try {
      authDetails.userInfos?.type === TypeUser.FUEL &&
        (await fuel.disconnect());
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

  const b256UserAddress =
    authDetails.userInfos?.address &&
    Address.fromString(authDetails.userInfos?.address).toB256();

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
                      {networkService.getName(currentNetwork.url)}
                    </Text>
                  </HStack>

                  {isWebAuthn && (
                    <Icon
                      color="grey.200"
                      fontSize={{ base: 'sm', sm: 'sm' }}
                      as={ChevronDownIcon}
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
                        as={
                          isMainnet(network.url ?? '') ? BakoIcon : UnknownIcon
                        }
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
                    <Icon as={PlusIcon} fontSize={16} />
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
                    address={authDetails.userInfos?.address ?? ''}
                    customAddress={AddressUtils.format(
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
                    addressProps={{
                      fontSize: isMobile ? 'xs' : 'md',
                    }}
                  />
                )}
              </Text>

              <Avatar
                variant="roundedSquare"
                src={authDetails.userInfos?.avatar}
                boxSize={isMobile ? '32px' : '40px'}
                border="1px solid #CFCCC9"
              />

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
                      minW="12px"
                      textAlign="center"
                      position="absolute"
                      top={-1}
                      right={-1}
                      px={unreadCounter >= 10 ? 0.5 : 0}
                    >
                      {unreadCounter}
                    </Text>
                  )}
                </HStack>
              )}
            </HStack>
            {!isMobile && (
              <Icon
                color="grey.200"
                fontSize={{ base: 'sm', sm: 'lg' }}
                as={ChevronDownIcon}
              />
            )}

            {unreadCounter > 0 && isMobile && (
              <Text
                fontSize="xs"
                rounded="full"
                bgColor="error.600"
                color="white"
                border="none"
                w="16px"
                textAlign="center"
                position="absolute"
                right={-2}
                top={-2}
              >
                {unreadCounter}
              </Text>
            )}
          </HStack>
        </PopoverTrigger>

        <PopoverContent
          bg={'dark.300'}
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
                address={authDetails.userInfos?.address ?? ''}
                justifyContent="start"
                aria-label="Copy address"
                isSidebarAddress
                flexDir="row-reverse"
                addressProps={{ color: '#AAA6A1' }}
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
                      w="16px"
                      textAlign="center"
                    >
                      {unreadCounter}
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
              <HStack cursor={'pointer'} onClick={logout} spacing={4}>
                <Icon color="grey.75" fontSize="xl" as={DisconnectIcon} />
                <Text color="grey.75" fontWeight={500}>
                  Disconnect
                </Text>
              </HStack>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

export { UserBox };
