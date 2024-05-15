import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  CircularProgress,
  Heading,
  HStack,
  Icon,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { TransactionStatus } from 'bakosafe';
import { format } from 'date-fns';
import { RiMenuUnfoldLine } from 'react-icons/ri';

import { CustomSkeleton, ErrorIcon, HomeIcon } from '@/components';
import { Drawer } from '@/layouts/dashboard/drawer';
import { useAuth } from '@/modules/auth';
import { Pages, useScreenSize } from '@/modules/core';
import { useHome } from '@/modules/home';
import {
  TransactionCard,
  TransactionFilter,
} from '@/modules/transactions/components';
import { useUserVaults, useVaultDetails } from '@/modules/vault';
import { useGetCurrentWorkspace, useWorkspace } from '@/modules/workspace';
import { limitCharacters } from '@/utils/limit-characters';

import TransactionEmptyState from '../../components/TransactionEmptyState';
import { StatusFilter, useTransactionList } from '../../hooks';
import { transactionStatus } from '../../utils';

const TransactionsVaultPage = () => {
  const {
    transactionRequest,
    infinityTransactionsRef,
    infinityTransactions,
    filter,
    inView,
    account,
    selectedTransaction,
    setSelectedTransaction,
    defaultIndex,
  } = useTransactionList();
  const { goHome } = useHome();
  const { vaultRequiredSizeToColumnLayout, isMobile } = useScreenSize();
  const menuDrawer = useDisclosure();
  const {
    workspaces: { current },
    isSingleWorkspace,
  } = useAuth();

  const { goWorkspace } = useWorkspace();
  const { workspace } = useGetCurrentWorkspace();
  const { navigate } = useUserVaults();
  const { vault, params } = useVaultDetails();

  const { vaultTransactions, loadingVaultTransactions } = vault.transactions;
  const hasTransactions =
    !loadingVaultTransactions && vaultTransactions?.length;

  return (
    <Box w="full" height="100%" maxH="100%">
      <Drawer isOpen={menuDrawer.isOpen} onClose={menuDrawer.onClose} />

      <Box mb={10}>
        {vaultRequiredSizeToColumnLayout ? (
          <HStack mt={2} gap={1.5} w="fit-content" onClick={menuDrawer.onOpen}>
            <Icon as={RiMenuUnfoldLine} fontSize="xl" color="grey.200" />
            <Text fontSize="sm" fontWeight="normal" color="grey.100">
              Menu
            </Text>
          </HStack>
        ) : (
          <Breadcrumb>
            <BreadcrumbItem>
              <Icon
                mt={1}
                mr={2}
                as={HomeIcon}
                fontSize="sm"
                color="grey.200"
              />
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() => goHome()}
              >
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
                Vaults
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() =>
                  navigate(
                    Pages.detailsVault({
                      vaultId: vault.id!,
                      workspaceId: current ?? '',
                    }),
                  )
                }
                isTruncated
                maxW={640}
              >
                {vault.name}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                href="#"
              >
                Transactions
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        )}
      </Box>

      {/* TITLE */}
      <HStack spacing={5} mb={7}>
        <Heading variant="title-xl" color="grey.200">
          Transactions
        </Heading>
        <CircularProgress
          hidden={!transactionRequest.isFetching}
          size="20px"
          color="brand.500"
          trackColor="dark.100"
          isIndeterminate
        />
      </HStack>

      {/* FILTER */}
      <TransactionFilter.Control
        value={filter.value!}
        onChange={(value) => {
          setSelectedTransaction({});
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
          value={TransactionStatus.AWAIT_REQUIREMENTS}
          label="Pending"
        />

        {selectedTransaction.id && (
          <HStack spacing={2}>
            <Text color="brand.500">{selectedTransaction.name}</Text>
            <Box
              onClick={() => {
                setSelectedTransaction({});
                filter.set(StatusFilter.ALL);
              }}
              cursor="pointer"
            >
              <Icon as={ErrorIcon} color="brand.500" />
            </Box>
          </HStack>
        )}
      </TransactionFilter.Control>

      {/* TRANSACTION LIST */}
      {hasTransactions ? (
        <TransactionCard.List
          mt={7}
          w="full"
          spacing={5}
          openIndex={defaultIndex}
          key={defaultIndex.join(',')}
          pb={10}
          maxH="77.5vh"
          overflowY="scroll"
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
              backgroundColor: 'transparent',
              borderRadius: '30px',
              height: '10px',
            },
          }}
        >
          {infinityTransactions?.map((transaction) => {
            const isSigner = !!transaction.predicate?.members?.find(
              (member) => member.address === account,
            );

            return (
              <Box key={transaction.id} ref={infinityTransactionsRef} w="full">
                <CustomSkeleton isLoaded={!transactionRequest.isLoading}>
                  <TransactionCard.Container
                    status={transactionStatus({ ...transaction, account })}
                    details={
                      <TransactionCard.Details
                        transaction={transaction}
                        isInTheVaultPage
                      />
                    }
                    transaction={transaction}
                    account={account}
                    isSigner={isSigner}
                    isInTheVaultPage
                    callBack={() => filter.set(StatusFilter.ALL)}
                  >
                    {!isMobile && (
                      <TransactionCard.CreationDate>
                        {format(new Date(transaction.createdAt), 'EEE, dd MMM')}
                      </TransactionCard.CreationDate>
                    )}
                    <TransactionCard.Assets />
                    <TransactionCard.Amount
                      assets={transaction.resume.outputs}
                    />
                    <TransactionCard.Name>
                      {limitCharacters(transaction.name, 20)}
                    </TransactionCard.Name>
                    <TransactionCard.Status
                      transaction={transaction}
                      status={transactionStatus({ ...transaction, account })}
                      showDescription={!isMobile}
                    />
                    <TransactionCard.Actions
                      isSigner={isSigner}
                      transaction={transaction}
                      status={transactionStatus({ ...transaction, account })}
                      callBack={() => filter.set(StatusFilter.ALL)}
                    />
                  </TransactionCard.Container>
                </CustomSkeleton>
              </Box>
            );
          })}
          <Box ref={inView.ref} />
        </TransactionCard.List>
      ) : (
        <TransactionEmptyState
          h="calc(100% - 170px)"
          mt={7}
          isDisabled={!vault?.hasBalance}
          buttonAction={() =>
            navigate(
              Pages.createTransaction({
                workspaceId: params.workspaceId!,
                vaultId: vault.id!,
              }),
            )
          }
        />
      )}
    </Box>
  );
};

export { TransactionsVaultPage };
