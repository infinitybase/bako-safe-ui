import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FaRegPlusSquare } from 'react-icons/fa';

import { CustomSkeleton, HomeIcon, VaultIcon } from '@/components';
import { AddressBookIcon } from '@/components/icons/address-book';
import { TransactionsIcon } from '@/components/icons/transactions';
import { Pages } from '@/modules/core/routes';
import { CreateVaultDialog, ExtraVaultCard, VaultCard } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { ActionCard } from '../components/ActionCard';
import HomeTransactions from '../components/HomeTransactions';

import { HomeQueryKey } from '@/modules/core';
import { useTransactionSocketListener } from '@/modules/transactions/hooks/events/useTransactionsSocketListener';

const HomePage = () => {
  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { handleWorkspaceSelection, navigate },
      requests: { latestPredicates },
      workspaceVaults: { extraCount, vaultsMax },
    },
  } = useWorkspaceContext();

  const recentVaults = latestPredicates.data?.predicates?.data;

  const { isOpen, onClose, onOpen } = useDisclosure();

  const workspaceId = userInfos.workspace?.id;

  const homeQueryKey = HomeQueryKey.HOME_WORKSPACE(workspaceId ?? '');

  useTransactionSocketListener(homeQueryKey ?? []);

  return (
    <VStack
      id="top"
      w="full"
      scrollMargin={20}
      spacing={6}
      p={{ base: 1, sm: 1 }}
      px={{ base: 'auto', sm: 8 }}
    >
      <CreateVaultDialog isOpen={isOpen} onClose={onClose} />
      <HStack w="full" h="10" justifyContent="space-between">
        <HStack visibility={{ base: 'hidden', sm: 'visible' }}>
          <Icon as={HomeIcon} fontSize="lg" color="grey.200" />
          <Text color="grey.400" fontWeight="semibold">
            Home
          </Text>
        </HStack>
        <Box>
          <Button
            variant="primary"
            fontWeight="bold"
            leftIcon={<FaRegPlusSquare />}
            onClick={onOpen}
          >
            Create vault
          </Button>
        </Box>
      </HStack>
      <Stack w="full" direction={{ base: 'column', md: 'row' }} spacing={6}>
        <CustomSkeleton isLoaded={!latestPredicates.isLoading}>
          <ActionCard.Container
            data-testid="vaultstab"
            flex={1}
            onClick={() =>
              navigate(Pages.userVaults({ workspaceId: workspaceId }))
            }
          >
            <ActionCard.Icon icon={VaultIcon} />
            <Box>
              <ActionCard.Title>Vaults</ActionCard.Title>
              <ActionCard.Description>
                Access and Manage All Your Vaults in One Place.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>
        </CustomSkeleton>

        <CustomSkeleton isLoaded={!latestPredicates.isLoading}>
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
            <ActionCard.Icon
              icon={TransactionsIcon}
              //isUpcoming={hasTransactions ? false : true}
            />
            <Box>
              <ActionCard.Title>Transactions</ActionCard.Title>
              <ActionCard.Description>
                Manage Transactions Across All Vaults in One Place.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>
        </CustomSkeleton>
        <CustomSkeleton isLoaded={!latestPredicates.isLoading}>
          <ActionCard.Container
            data-testid="adressBookTab"
            flex={1}
            onClick={() =>
              navigate(Pages.addressBook({ workspaceId: workspaceId }))
            }
          >
            <ActionCard.Icon icon={AddressBookIcon} />
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
        isLoaded={!latestPredicates.isLoading}
        minH={latestPredicates.isLoading ? '$100vh' : 'fit-content'}
        mt={latestPredicates.isLoading ? 6 : 4}
      >
        {recentVaults?.length ? (
          <Box pb={6} alignSelf="flex-start">
            <Text
              color="grey.400"
              variant="subtitle"
              fontWeight="semibold"
              fontSize="md"
            >
              Recently used vaults
            </Text>
          </Box>
        ) : null}
        {recentVaults?.length ? (
          <Grid
            mt={{ base: -8, sm: -2 }}
            w="full"
            maxW="full"
            gap={6}
            templateColumns={{
              base: 'repeat(1, 1fr)',
              xs: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              '2xl': 'repeat(4, 1fr)',
            }}
          >
            {recentVaults?.map(
              ({ id, name, workspace, members, description, owner }, index) => {
                const lastCard = index === vaultsMax - 1;
                const hasMore = extraCount > 0;

                return (
                  <CustomSkeleton
                    isLoaded={!latestPredicates.isLoading || !!recentVaults}
                    key={id}
                    maxH={{ base: 180, sm: 190 }}
                  >
                    <GridItem>
                      {lastCard && hasMore ? (
                        <ExtraVaultCard
                          mt={{ base: 6, sm: 'unset' }}
                          maxH={{ base: 185, sm: 190 }}
                          extra={extraCount}
                          onClick={() =>
                            navigate(
                              Pages.userVaults({
                                workspaceId: workspaceId,
                              }),
                            )
                          }
                        />
                      ) : (
                        <VaultCard
                          ownerId={owner.id}
                          name={name}
                          workspace={workspace}
                          title={description}
                          members={members!}
                          onClick={() =>
                            handleWorkspaceSelection(
                              workspace.id,
                              Pages.detailsVault({
                                workspaceId: workspace.id,
                                vaultId: id,
                              }),
                            )
                          }
                        />
                      )}
                    </GridItem>
                  </CustomSkeleton>
                );
              },
            )}
          </Grid>
        ) : null}
        {/* TRANSACTION LIST */}
        <Box minH="650px">
          <HomeTransactions />
        </Box>
      </CustomSkeleton>
    </VStack>
  );
};

export { HomePage };
