import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Heading,
  HStack,
  Icon,
  Stack,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FaRegPlusSquare } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';

import { CustomSkeleton, HomeIcon, VaultIcon } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { AddressBookIcon } from '@/components/icons/address-book';
import { TransactionsIcon } from '@/components/icons/transactions';
import { useAuth } from '@/modules/auth';
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

const UserTransactionsPage = () => {
  const {
    infinityTransactions,
    infinityTransactionsRef,
    transactionRequest,
    filter,
    inView,
    account,
    navigate,
    pendingSignerTransactions,
    hasSkeleton,
  } = useTransactionList();

  const { hasPermission, goWorkspace } = useWorkspace();
  const {
    isSingleWorkspace,
    workspaces: { current },
  } = useAuth();

  const { workspace } = useGetCurrentWorkspace();

  const { goHome } = useHome();

  const { isMobile, isExtraSmall } = useScreenSize();

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
      <HStack w="full" h="10" justifyContent="space-between" my={2}>
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
        <Box
          w="full"
          display="flex"
          flexDir={isExtraSmall ? 'column' : 'row'}
          gap={isExtraSmall ? 2 : 4}
        >
          <Heading variant="title-xl" color="grey.200">
            Transactions
          </Heading>
          <WaitingSignatureBadge
            isLoading={pendingSignerTransactions.isLoading}
            quantity={pendingSignerTransactions.data?.ofUser ?? 0}
          />
        </Box>

        {/* FILTER */}
        <Box w="full" mt={3}>
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
      </VStack>

      {/* LIST */}
      <TransactionCard.List
        mt={1}
        w="full"
        spacing={{ base: 3, sm: 5 }}
        maxH="74vh"
        overflowY="scroll"
        overflowX="hidden"
        scrollBehavior="smooth"
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

        {infinityTransactions?.map((transaction) => {
          const isSigner = !!transaction.predicate?.members?.find(
            (member) => member.address === account,
          );

          return (
            <Box w="full" key={transaction.id} ref={infinityTransactionsRef}>
              <CustomSkeleton key={transaction.id} isLoaded={!hasSkeleton}>
                {isMobile ? (
                  <TransactionCardMobile
                    isSigner={isSigner}
                    transaction={transaction}
                    account={account}
                    callBack={() => filter.set(StatusFilter.ALL)}
                  />
                ) : (
                  <TransactionCard.Container
                    status={transactionStatus({ ...transaction, account })}
                    details={
                      <TransactionCard.Details transaction={transaction} />
                    }
                    transaction={transaction}
                    account={account}
                    isSigner={isSigner}
                  >
                    {transaction.predicate && (
                      <TransactionCard.VaultInfo
                        vault={transaction.predicate}
                      />
                    )}
                    {/* <TransactionCard.CreationDate>
                      {format(new Date(transaction.createdAt), 'EEE, dd MMM')}
                    </TransactionCard.CreationDate> */}
                    <TransactionCard.Assets />
                    <TransactionCard.Amount
                      assets={transaction.resume.outputs}
                    />
                    <TransactionCard.Name vaultName={transaction.name} />
                    <TransactionCard.Status
                      transaction={transaction}
                      status={transactionStatus({ ...transaction, account })}
                    />
                    <TransactionCard.Actions
                      isSigner={isSigner}
                      transaction={transaction}
                      status={transactionStatus({ ...transaction, account })}
                      callBack={() => filter.set(StatusFilter.ALL)}
                    />
                  </TransactionCard.Container>
                )}
              </CustomSkeleton>
            </Box>
          );
        })}
        <Box ref={inView.ref} />
      </TransactionCard.List>
    </VStack>
  );
};

export { UserTransactionsPage };
