import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FaRegPlusSquare } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';
import {
  CustomSkeleton,
  HomeIcon,
  TransactionTypeFilters,
  VaultIcon,
} from '@/components';
import { EmptyState } from '@/components/emptyState';
import { AddressBookIcon } from '@/components/icons/address-book';
import { TransactionsIcon } from '@/components/icons/transactions';
import { Pages, PermissionRoles, useScreenSize } from '@/modules/core';
import { ActionCard } from '@/modules/home/components/ActionCard';
import { useHome } from '@/modules/home/hooks/useHome';
import { CreateVaultDialog } from '@/modules/vault';
import { useGetCurrentWorkspace, useWorkspace } from '@/modules/workspace';
import {
  TransactionCard,
  TransactionCardMobile,
  TransactionFilter,
  WaitingSignatureBadge,
} from '../../components';
import { StatusFilter, useTransactionList } from '../../hooks';
import { transactionStatus } from '../../utils';
import { useFilterTxType } from '../../hooks/filter';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const UserTransactionsPage = () => {
  const { txFilterType, handleIncomingAction, handleOutgoingAction } =
    useFilterTxType();

  const {
    infinityTransactions,
    infinityTransactionsRef,
    transactionRequest,
    filter,
    inView,
    account,
    navigate,
    pendingSignerTransactions,
  } = useTransactionList({ type: txFilterType, byMonth: true });

  const { hasPermission, goWorkspace } = useWorkspace();
  const {
    isSingleWorkspace,
    workspaces: { current },
  } = useWorkspaceContext();

  const { workspace } = useGetCurrentWorkspace();

  const { goHome } = useHome();

  const { isMobile, isExtraSmall, isSmall } = useScreenSize();

  const { OWNER, MANAGER, ADMIN } = PermissionRoles;
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <VStack
      w="full"
      spacing={6}
      p={{ base: 1, sm: 1 }}
      px={{ base: 'auto', sm: 8 }}
    >
      <CreateVaultDialog isOpen={isOpen} onClose={onClose} />
      <HStack w="full" h="10" justifyContent="space-between">
        <HStack>
          <Button
            variant="primary"
            fontWeight="semibold"
            fontSize={15}
            leftIcon={
              <Box mr={-1}>
                <IoChevronBack size={22} />
              </Box>
            }
            px={3}
            bg="dark.100"
            color="grey.200"
            onClick={() =>
              isSingleWorkspace ? goHome() : goWorkspace(current ?? '')
            }
          >
            Back home
          </Button>

          {!isMobile && (
            <>
              <Breadcrumb ml={8}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    fontSize="sm"
                    color="grey.200"
                    fontWeight="semibold"
                    onClick={() => goHome()}
                  >
                    <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {!isSingleWorkspace && (
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      fontSize="sm"
                      color="grey.200"
                      fontWeight="semibold"
                      onClick={() => goWorkspace(current)}
                      maxW={40}
                      isTruncated
                    >
                      {workspace?.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )}

                <BreadcrumbItem>
                  <BreadcrumbLink
                    fontSize="sm"
                    color="grey.200"
                    fontWeight="semibold"
                    href="#"
                  >
                    My Transactions
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </>
          )}
        </HStack>
        <Box>
          <Button
            isDisabled={!hasPermission([OWNER, MANAGER, ADMIN])}
            variant="primary"
            fontWeight="bold"
            leftIcon={<FaRegPlusSquare />}
            onClick={onOpen}
          >
            Create vault
          </Button>
        </Box>
      </HStack>

      {/* ACTION BUTTONS */}
      <Stack w="full" direction={{ base: 'column', md: 'row' }} spacing={6}>
        <ActionCard.Container
          onClick={() =>
            navigate(
              Pages.userVaults({
                workspaceId: current ?? '',
              }),
            )
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

        <ActionCard.Container cursor="auto">
          <ActionCard.Icon icon={TransactionsIcon} />
          <Box>
            <ActionCard.Title>Transactions</ActionCard.Title>
            <ActionCard.Description>
              Manage Transactions Across All Vaults in One Place.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>

        <ActionCard.Container
          onClick={() =>
            navigate(
              Pages.addressBook({
                workspaceId: current ?? '',
              }),
            )
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
      </Stack>

      {/* USER TRANSACTIONS */}
      <VStack w="full" mt={6}>
        <HStack
          justifyContent="space-between"
          alignItems={isSmall ? 'start' : 'center'}
          w="full"
          flexDir={isSmall ? 'column' : 'row'}
        >
          <Box
            w="full"
            display="flex"
            flexDir={isExtraSmall ? 'column' : 'row'}
            gap={isExtraSmall ? 2 : 4}
          >
            <Heading fontSize="sm" color="grey.200">
              Transactions
            </Heading>
            <WaitingSignatureBadge
              isLoading={pendingSignerTransactions.isLoading}
              quantity={pendingSignerTransactions.data?.ofUser ?? 0}
            />
          </Box>
          {!isSmall && (
            <TransactionTypeFilters
              currentFilter={txFilterType}
              incomingAction={handleIncomingAction}
              outgoingAction={handleOutgoingAction}
            />
          )}
        </HStack>

        {/* FILTER */}
        <VStack w="full" alignItems="start">
          <Box>
            <TransactionFilter.Control
              value={filter.value!}
              onChange={(value) => {
                filter.set(value as StatusFilter);
              }}
            >
              <TransactionFilter.Field value={StatusFilter.ALL} label="All" />
              <TransactionFilter.Field
                value={StatusFilter.COMPLETED}
                label="Completed"
              />
              <TransactionFilter.Field
                value={StatusFilter.DECLINED}
                label="Declined"
              />
              <TransactionFilter.Field
                value={StatusFilter.PENDING}
                label="Pending"
              />
            </TransactionFilter.Control>
          </Box>
          {isSmall && (
            <TransactionTypeFilters
              mt={2}
              currentFilter={txFilterType}
              incomingAction={handleIncomingAction}
              outgoingAction={handleOutgoingAction}
              buttonsFullWidth
            />
          )}
        </VStack>
      </VStack>

      {/* LIST */}
      <VStack
        minH="55vh"
        maxH="74vh"
        mt={-3}
        overflowY="scroll"
        overflowX="hidden"
        scrollBehavior="smooth"
        w="full"
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
            width: '5px',
            maxHeight: '330px',
            backgroundColor: 'grey.200',
            borderRadius: '30px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#2C2C2C',
            borderRadius: '30px',
            height: '10px',
          },
        }}
      >
        {!transactionRequest.isLoading &&
          !transactionRequest?.transactions.length && (
            <EmptyState showAction={false} />
          )}
        {infinityTransactions?.map((grouped) => (
          <>
            <HStack w="full">
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="grey.425"
                whiteSpace="nowrap"
              >
                {grouped.monthYear}
              </Text>

              <Divider w="full" borderColor="grey.950" />
            </HStack>
            <TransactionCard.List mt={1} w="full" spacing={0}>
              {grouped?.transactions.map((transaction) => {
                const status = transactionStatus({
                  ...transaction,
                  account,
                });
                const isSigner = !!transaction.predicate?.members?.find(
                  (member) => member.address === account,
                );

                return (
                  <>
                    <Box
                      key={transaction.id}
                      ref={infinityTransactionsRef}
                      w="full"
                    >
                      <CustomSkeleton isLoaded={!transactionRequest.isLoading}>
                        {isMobile ? (
                          <TransactionCardMobile
                            isSigner={isSigner}
                            transaction={transaction}
                            account={account}
                            mt="15px"
                          />
                        ) : (
                          <TransactionCard.Container
                            mb="11px"
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
                      </CustomSkeleton>
                    </Box>

                    <Box ref={inView.ref} />
                  </>
                );
              })}
            </TransactionCard.List>
          </>
        ))}
      </VStack>
    </VStack>
  );
};

export { UserTransactionsPage };
