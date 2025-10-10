import {
  Box,
  Button,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { FaRegPlusSquare } from 'react-icons/fa';

import { CustomSkeleton, HomeIcon, VaultIcon } from '@/components';
import { AddressBookIcon } from '@/components/icons/address-book';
import { TransactionsIcon } from '@/components/icons/transactions';
import { HomeQueryKey } from '@/modules/core';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { Pages } from '@/modules/core/routes';
import { useTransactionSocketListener } from '@/modules/transactions/hooks/events/useTransactionsSocketListener';
import { CreateVaultDialog } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { ActionCard } from '../components/ActionCard';
import HomeTransactions from '../components/HomeTransactions';
import RecentVaultsList from '../components/RecentVaultsList';

const HomePage = () => {
  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { navigate },
      requests: { latestPredicates },
    },
  } = useWorkspaceContext();

  const recentVaults = useMemo(
    () => latestPredicates.data?.predicates?.data,
    [latestPredicates],
  );

  const { isOpen, setOpen, onOpen } = useDisclosure();

  const workspaceId = userInfos.workspace?.id;

  const homeQueryKey = HomeQueryKey.HOME_WORKSPACE(workspaceId ?? '');

  useTransactionSocketListener(homeQueryKey ?? []);

  return (
    <VStack
      id="top"
      w="full"
      scrollMargin={20}
      gap={6}
      p={{ base: 1, sm: 1 }}
      px={{ base: 'auto', sm: 8 }}
    >
      <CreateVaultDialog open={isOpen} onOpenChange={(e) => setOpen(e.open)} />
      <HStack w="full" h="10" justifyContent="space-between">
        <HStack visibility={{ base: 'hidden', sm: 'visible' }}>
          <Icon as={HomeIcon} fontSize="lg" color="grey.200" />
          <Text color="grey.400" fontWeight="semibold">
            Home
          </Text>
        </HStack>
        <Box>
          <Button colorPalette="primary" fontWeight="bold" onClick={onOpen}>
            <FaRegPlusSquare />
            Create vault
          </Button>
        </Box>
      </HStack>
      <Stack w="full" direction={{ base: 'column', md: 'row' }} gap={6}>
        <CustomSkeleton loading={latestPredicates.isLoading}>
          <ActionCard.Container
            data-testid="vaultstab"
            flex={1}
            onClick={() =>
              navigate(Pages.userVaults({ workspaceId: workspaceId }))
            }
          >
            <ActionCard.Icon>
              <VaultIcon w={7} />
            </ActionCard.Icon>
            <Box>
              <ActionCard.Title>Vaults</ActionCard.Title>
              <ActionCard.Description>
                Access and Manage All Your Vaults in One Place.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>
        </CustomSkeleton>

        <CustomSkeleton loading={latestPredicates.isLoading}>
          <ActionCard.Container
            data-testid="transactionTab"
            flex={1}
            onClick={() => {
              return navigate(
                Pages.userTransactions({
                  workspaceId: workspaceId,
                }),
              );
            }}
          >
            <ActionCard.Icon>
              <TransactionsIcon w={7} />
            </ActionCard.Icon>
            <Box>
              <ActionCard.Title>Transactions</ActionCard.Title>
              <ActionCard.Description>
                Manage Transactions Across All Vaults in One Place.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>
        </CustomSkeleton>

        <CustomSkeleton loading={latestPredicates.isLoading}>
          <ActionCard.Container
            data-testid="adressBookTab"
            flex={1}
            onClick={() =>
              navigate(Pages.addressBook({ workspaceId: workspaceId }))
            }
          >
            <ActionCard.Icon>
              <AddressBookIcon w={7} />
            </ActionCard.Icon>
            <Box>
              <ActionCard.Title>Address book</ActionCard.Title>
              <ActionCard.Description>
                Access and Manage Your Contacts for Easy Transfers and Vault
                Creation.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>
        </CustomSkeleton>
      </Stack>
      {/* RECENT VAULTS */}
      <CustomSkeleton
        h="full"
        loading={latestPredicates.isLoading}
        minH={latestPredicates.isLoading ? '$100vh' : 'fit-content'}
      >
        {!!recentVaults?.length && (
          <RecentVaultsList
            predicates={recentVaults}
            isLoading={latestPredicates.isLoading}
          />
        )}

        {/* TRANSACTION LIST */}
        <Box minH="650px">
          <HomeTransactions />
        </Box>
      </CustomSkeleton>
    </VStack>
  );
};

export { HomePage };
