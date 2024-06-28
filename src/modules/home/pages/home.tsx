import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FaRegPlusSquare } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';

import { CustomSkeleton, HomeIcon, VaultIcon } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { AddressBookIcon } from '@/components/icons/address-book';
import { TransactionsIcon } from '@/components/icons/transactions';
import { useAuth } from '@/modules/auth';
import { useScreenSize } from '@/modules/core';
import { Pages } from '@/modules/core/routes';
import {
  TransactionCard,
  TransactionCardMobile,
  transactionStatus,
  WaitingSignatureBadge,
} from '@/modules/transactions';
import { CreateVaultDialog, ExtraVaultCard, VaultCard } from '@/modules/vault';
import { useSelectWorkspace } from '@/modules/workspace';

import { useHome } from '..';
import { ActionCard } from '../components/ActionCard';

const HomePage = () => {
  const {
    account,
    navigate,
    vaultsRequest: {
      vaults: { recentVaults, extraCount, vaultsMax },
    },
    transactionsRequest: { transactions },
    pendingSignerTransactions,
    homeRequest,
  } = useHome();

  const {
    workspaces: { current, single },
  } = useAuth();

  const { selectWorkspace } = useSelectWorkspace();

  const { isMobile, isExtraSmall } = useScreenSize();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const month = Object.keys(transactions ?? {})[0];
  const transactionsArray = transactions?.[month];

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
        <CustomSkeleton isLoaded={!homeRequest.isLoading}>
          <ActionCard.Container
            flex={1}
            onClick={() => navigate(Pages.userVaults({ workspaceId: current }))}
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

        <CustomSkeleton isLoaded={!homeRequest.isLoading}>
          <ActionCard.Container
            flex={1}
            onClick={() => {
              return navigate(
                Pages.userTransactions({
                  workspaceId: current,
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
        <CustomSkeleton isLoaded={!homeRequest.isLoading}>
          <ActionCard.Container
            flex={1}
            onClick={() =>
              navigate(Pages.addressBook({ workspaceId: current }))
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
        isLoaded={!homeRequest.isLoading}
        minH={homeRequest.isLoading ? '100vh' : 'fit-content'}
        mt={homeRequest.isLoading ? 6 : 4}
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
              ({ id, name, workspace, members, description }, index) => {
                const lastCard = index === vaultsMax - 1;
                const hasMore = extraCount > 0;

                return (
                  <CustomSkeleton
                    isLoaded={!homeRequest.isLoading || !!recentVaults}
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
                                workspaceId: single,
                              }),
                            )
                          }
                        />
                      ) : (
                        <VaultCard
                          id={id}
                          name={name}
                          workspace={workspace}
                          title={description}
                          members={members!}
                          onClick={async () => {
                            selectWorkspace(workspace.id, {
                              onSelect: async (_workspace) => {
                                navigate(
                                  Pages.detailsVault({
                                    workspaceId: _workspace.id,
                                    vaultId: id,
                                  }),
                                );
                              },
                            });
                          }}
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
        {transactionsArray && transactionsArray.length <= 0 ? (
          <VStack w="full" spacing={6}>
            {transactionsArray && (
              <HStack w="full" spacing={4}>
                <Text
                  variant="subtitle"
                  fontWeight={700}
                  fontSize="md"
                  color="grey.50"
                >
                  Transactions
                </Text>
              </HStack>
            )}
            <CustomSkeleton
              isLoaded={!homeRequest.isLoading}
              mt={{
                base: recentVaults?.length ? 16 : 0,
                sm: recentVaults?.length ? 8 : 0,
                md: recentVaults?.length ? 8 : 2,
              }}
            >
              <EmptyState showAction={false} />
            </CustomSkeleton>
          </VStack>
        ) : (
          <Box w="full" mt={{ base: 16, sm: 8 }}>
            <Box
              w="full"
              display="flex"
              flexDir={isExtraSmall ? 'column' : 'row'}
              gap={isExtraSmall ? 6 : 4}
              mb={isExtraSmall ? 0 : 4}
            >
              <Box
                display="flex"
                flexDir={isExtraSmall ? 'column' : 'row'}
                alignItems={isExtraSmall ? 'unset' : 'center'}
                gap={isExtraSmall ? 2 : 4}
              >
                <Text fontWeight={700} fontSize="md" color="grey.50">
                  Transactions
                </Text>
                <WaitingSignatureBadge
                  isLoading={pendingSignerTransactions.isLoading}
                  quantity={pendingSignerTransactions.data?.ofUser ?? 0}
                />
              </Box>
              <Spacer />
              <Button
                color="brand.400"
                textDecoration="none"
                alignItems="center"
                justifyContent="center"
                display={{ base: 'none', sm: 'flex' }}
                backgroundColor="transparent"
                _hover={{
                  backgroundColor: 'transparent',
                }}
                rightIcon={<Icon as={MdKeyboardArrowRight} boxSize={6} />}
                onClick={() =>
                  navigate(
                    Pages.userTransactions({
                      workspaceId: single,
                    }),
                  )
                }
              >
                View all
              </Button>
            </Box>

            <Text fontSize="sm" fontWeight="semibold" color="grey.425">
              {month}
            </Text>
            <TransactionCard.List spacing={4} mt={isExtraSmall ? 0 : 7} mb={12}>
              <CustomSkeleton isLoaded={!homeRequest.isLoading}>
                {transactionsArray?.map((transaction) => {
                  const status = transactionStatus({ ...transaction, account });
                  const isSigner = !!transaction.predicate?.members?.find(
                    (member) => member.address === account,
                  );

                  return (
                    <>
                      {isMobile ? (
                        <TransactionCardMobile
                          isSigner={isSigner}
                          transaction={transaction}
                          account={account}
                          mt={3}
                        />
                      ) : (
                        <TransactionCard.Container
                          mb={4}
                          key={transaction.id}
                          status={status}
                          isSigner={isSigner}
                          transaction={transaction}
                          account={account}
                          details={
                            <TransactionCard.Details
                              transaction={transaction}
                              status={status}
                            />
                          }
                        />
                      )}
                    </>
                  );
                })}
              </CustomSkeleton>
            </TransactionCard.List>
          </Box>
        )}
      </CustomSkeleton>
    </VStack>
  );
};

export { HomePage };
