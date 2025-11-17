import { usePrivy } from '@privy-io/react-auth';
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Loader,
  Text,
  VStack,
} from 'bako-ui';
import { useEffect } from 'react';

import { EmptyBox } from '@/components';
import { Dapp } from '@/layouts/dapp';
import { useAuth, useQueryParams } from '@/modules/auth';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { CreateVaultDialog } from '@/modules/vault';
import { VaultItemBox } from '@/modules/vault/components/modal/box';
import { useVaultDrawer } from '@/modules/vault/components/modal/hook';
import { decodeConnectorType } from '@/utils';

import { DappTransaction } from '../components';
import { useAuthSocket } from '../hooks';
import {
  UserConnectorCompatibilityState,
  useUserConnectorCompatibility,
} from '../hooks/useUserConnectorCompatibility';

const VaultConnector = () => {
  const { name, origin, sessionId, request_id, connectorType } =
    useQueryParams();

  const { userInfos, handlers } = useAuth();
  const { ready } = usePrivy();
  const { compatibilityState, setCompatibilityState, checkCompatibility } =
    useUserConnectorCompatibility();

  const {
    request: { vaults, isSuccess, isLoading, isFetching },
    inView,
  } = useVaultDrawer({ perPage: 10, orderByRoot: true });

  const { selectedVaultId, setSelectedVaultId, currentVault, send } =
    useAuthSocket();

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const connector = decodeConnectorType(connectorType || '');
  const noVaultsAvailable = isSuccess && !vaults.length;
  const isLoadingVaults =
    isLoading ||
    userInfos.isLoading ||
    !ready ||
    compatibilityState !== UserConnectorCompatibilityState.COMPATIBLE;

  useEffect(() => {
    if (
      vaults.length === 1 &&
      vaults[0]?.id &&
      !send.isPending &&
      name &&
      origin &&
      sessionId &&
      request_id &&
      userInfos.address &&
      compatibilityState === UserConnectorCompatibilityState.COMPATIBLE
    ) {
      send.mutate({
        name: name,
        origin: origin,
        sessionId: sessionId,
        request_id: request_id,
        vaultId: vaults[0].id,
        userAddress: userInfos.address,
      });
    }
  }, [
    name,
    origin,
    request_id,
    send,
    sessionId,
    userInfos.address,
    vaults,
    compatibilityState,
  ]);

  useEffect(() => {
    if (
      connector &&
      userInfos?.address &&
      userInfos?.type.type &&
      !userInfos?.isFetching &&
      !userInfos?.isLoading
    ) {
      const isCompatible = checkCompatibility(connector, userInfos.type.type);
      setCompatibilityState(
        isCompatible
          ? UserConnectorCompatibilityState.COMPATIBLE
          : UserConnectorCompatibilityState.INCOMPATIBLE,
      );
    }
  }, [
    connector,
    userInfos?.address,
    userInfos?.type.type,
    userInfos?.isFetching,
    userInfos?.isLoading,
  ]);

  useEffect(() => {
    if (compatibilityState === UserConnectorCompatibilityState.INCOMPATIBLE)
      handlers.logout?.();
  }, [compatibilityState]);

  return (
    <Dapp.Container>
      <Dapp.Profile />

      <Dapp.ScrollableContent isLoading={isLoadingVaults}>
        <CreateVaultDialog open={isOpen} onOpenChange={onOpenChange} />

        <Dapp.Header title="Accounts" />

        <VStack w="full" gap={2}>
          {vaults?.map((vault) => {
            if (!vault) return null;

            const { id, name, predicateAddress, workspace, members, root } =
              vault;

            if (id === currentVault && !selectedVaultId) setSelectedVaultId(id);

            if (id !== currentVault && !selectedVaultId && root)
              setSelectedVaultId(id);

            return (
              <VaultItemBox
                key={id}
                name={name}
                workspace={workspace}
                members={members?.length}
                address={predicateAddress}
                root={false}
                id={id}
                isActive={selectedVaultId === id}
                isSingleWorkspace={workspace.single}
                onClick={() => setSelectedVaultId(id)}
                isInDapp
                mt={0}
              />
            );
          })}

          {isFetching && vaults.length && (
            <Flex justifyContent="center" alignItems="center" p={6}>
              <Loader color="brand.500" size="md" />
            </Flex>
          )}

          {/* Normally, it's a self closing box (<Box/>) but due the dynamic height using window.height */}
          {/* it's necessary to render it this way */}
          <Box ref={inView.ref} color="transparent">
            ...
          </Box>
        </VStack>

        {/* No vaults */}
        {!isFetching && noVaultsAvailable && (
          <VStack mb={6} h={'full'} gap={5}>
            <Card.Root
              w="full"
              bgColor="transparent"
              display="flex"
              borderWidth={1}
              borderColor="grey.300"
              justifyContent="center"
              flexDirection="column"
              alignItems="center"
              h={224}
              my={1}
            >
              <Flex
                alignItems="center"
                justifyContent="center"
                bg="linear-gradient(132.19deg, rgba(255, 192, 16, 0.1) 0%, rgba(235, 163, 18, 0.1) 48%, rgba(211, 128, 21, 0.1) 71%, rgba(178, 79, 24, 0.1) 99%);"
                rounded={10}
                w="57px"
                h="56px"
              >
                <EmptyBox w="33px" h="33px" />
              </Flex>
              <Flex w={305} alignItems="center" flexDir="column" gap={6} mt={4}>
                <Heading color="grey.75" fontSize={20}>
                  Nothing to show here.
                </Heading>
                <Text
                  color="grey.450"
                  fontSize={12}
                  textAlign="center"
                  fontWeight="medium"
                >
                  It seems like you {"haven't"} any Vault yet.
                </Text>
              </Flex>
            </Card.Root>
            <Button bg="grey.75" fontSize={14} onClick={onOpen} w="full">
              Create new Vault
            </Button>
          </VStack>
        )}
      </Dapp.ScrollableContent>

      <Dapp.FixedFooter>
        <DappTransaction.RequestingFrom name={name} origin={origin} />
        <HStack gap={6} w="full">
          <Button
            variant="subtle"
            color="gray.300"
            bgColor="gray.600"
            px="20px"
            fontWeight={400}
            onClick={() => {
              handlers.logout?.(true, window.close);
            }}
            w={noVaultsAvailable ? 'full' : 'unset'}
          >
            Cancel
          </Button>

          {!noVaultsAvailable && (
            <Button
              flex={1}
              colorPalette="primary"
              fontWeight={600}
              fontSize={14}
              disabled={
                !selectedVaultId ||
                !vaults.length ||
                send.isPending ||
                isLoadingVaults
              }
              onClick={() => {
                send.mutate({
                  name: name!,
                  origin: origin!,
                  sessionId: sessionId!,
                  request_id: request_id!,
                  vaultId: selectedVaultId,
                  userAddress: userInfos.address,
                });
              }}
              loading={send.isPending}
            >
              Connect
            </Button>
          )}
        </HStack>
      </Dapp.FixedFooter>
    </Dapp.Container>
  );
};

export { VaultConnector };
