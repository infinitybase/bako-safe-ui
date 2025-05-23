import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  HStack,
  Icon,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CustomSkeleton, HomeIcon, TransactionTypeFilters } from '@/components';
import AddAssetsDialog from '@/components/addAssetsDialog';
import DepositDialog from '@/components/depositDialog';
import { EmptyState } from '@/components/emptyState';
import { MenuIcon } from '@/components/icons/menu';
import WelcomeDialog from '@/components/welcomeDialog';
import { Drawer } from '@/layouts/dashboard/drawer';
import { PermissionRoles } from '@/modules/core';
import { useGetParams } from '@/modules/core/hooks';
import { Pages } from '@/modules/core/routes';
import { useTemplateStore } from '@/modules/template/store/useTemplateStore';
import { TransactionCard, WaitingSignatureBadge } from '@/modules/transactions';
import { useTransactionSocketListener } from '@/modules/transactions/hooks/events/useTransactionsSocketListener';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { limitCharacters } from '@/utils/limit-characters';

import { CardDetails } from '../../components/CardDetails';
import { SignersDetails } from '../../components/SignersDetails';
import { vaultInfinityQueryKey } from '../../hooks/list/useVaultTransactionsRequest';
import { useVaultInfosContext } from '../../VaultInfosProvider';

const VaultDetailsPage = () => {
  const [welcomeDialogState, setWelcomeDialogState] = useState(true);
  const [addAssetsDialogState, setAddAssetsDialogState] = useState(false);
  const [depositDialogState, setDepositDialogState] = useState(false);
  const menuDrawer = useDisclosure();
  const navigate = useNavigate();
  const { vaultPageParams } = useGetParams();
  const { vault, assets } = useVaultInfosContext();

  const {
    vaultTransactions: {
      filter: { txFilterType },
      lists: { transactions },
      request: { isLoading, isFetching, queryKey },
      handlers: { handleIncomingAction, handleOutgoingAction },
      transactionsRef,
    },
    pendingSignerTransactions,
    isPendingSigner,
  } = useTransactionsContext();
  const queryClient = useQueryClient();

  const { setTemplateFormInitial } = useTemplateStore();

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: {
        // handleWorkspaceSelection,
        hasPermission,
        goHome,
      },
    },
    screenSizes: {
      vaultRequiredSizeToColumnLayout,
      isSmall,
      isMobile,
      isLarge,
    },
  } = useWorkspaceContext();

  const workspaceId = userInfos.workspace?.id ?? '';
  const hasTransactions = !isLoading && transactions?.length;

  const { OWNER, SIGNER } = PermissionRoles;

  const canSetTemplate = hasPermission([SIGNER]) || hasPermission([OWNER]);

  const hideSetTemplateButton = true;

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey, exact: true });
    };
  }, []);

  const vaultQueryKey =
    vaultInfinityQueryKey.VAULT_TRANSACTION_LIST_PAGINATION_QUERY_KEY(
      vault.data?.id ?? undefined,
    );

  useTransactionSocketListener(vaultQueryKey ?? []);

  if (!vault) return null;

  return (
    <Box w="full">
      <Drawer isOpen={menuDrawer.isOpen} onClose={menuDrawer.onClose} />

      <WelcomeDialog
        isOpen={welcomeDialogState}
        setIsWelcomeDialogOpen={setWelcomeDialogState}
        setIsDepositDialogOpen={setDepositDialogState}
      />

      <DepositDialog
        isOpen={depositDialogState}
        setIsDepositDialogOpen={setDepositDialogState}
        vault={vault.data}
      />

      <AddAssetsDialog
        isOpen={addAssetsDialogState}
        setIsAddAssetDialogOpen={setAddAssetsDialogState}
        setIsDepositDialogOpen={setDepositDialogState}
      />

      <HStack mb={9} w="full" justifyContent="space-between">
        {vaultRequiredSizeToColumnLayout ? (
          <HStack gap={4} onClick={menuDrawer.onOpen}>
            <Icon as={MenuIcon} fontSize="md" color="grey.200" />
            <Text fontSize="sm" fontWeight="normal" color="grey.100">
              Menu
            </Text>
          </HStack>
        ) : (
          <Breadcrumb>
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

            {/* Commented out code to temporarily disable workspaces. */}

            {/* {!userInfos.onSingleWorkspace && (
              <BreadcrumbItem>
                <BreadcrumbLink
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() =>
                    handleWorkspaceSelection(
                      workspaceId,
                      Pages.workspace({
                        workspaceId: userInfos.workspace?.id,
                      }),
                      true,
                    )
                  }
                  maxW={40}
                  isTruncated
                >
                  {userInfos.workspace?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )} */}

            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() =>
                  navigate(
                    Pages.userVaults({
                      workspaceId,
                    }),
                  )
                }
              >
                Vaults
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                href="#"
                isTruncated
                maxW={640}
              >
                {limitCharacters(vault?.data?.name ?? '', 25)}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        )}
        {!hideSetTemplateButton && (
          <Button
            color="dark.200"
            bgColor="grey.200"
            fontWeight="medium"
            fontSize={{ base: 'sm', sm: 'md' }}
            border="none"
            isDisabled={!canSetTemplate || true} // todo: fix this
            onClick={() => {
              if (
                !vault.data?.id ||
                !vault.data?.minSigners ||
                !vault.data.members ||
                !vaultPageParams.workspaceId
              )
                return;
              setTemplateFormInitial({
                minSigners: vault.data?.minSigners,
                addresses:
                  vault.data.members! &&
                  vault.data?.members.map((signer) => signer.address),
              });
              navigate(
                Pages.createTemplate({
                  vaultId: vault.data.id!,
                  workspaceId: vaultPageParams.workspaceId!,
                }),
              );
            }}
          >
            Set as template
          </Button>
        )}
      </HStack>

      <HStack
        mb={{ base: 10, sm: 14 }}
        alignItems="flex-start"
        w="full"
        gap={10}
      >
        <CardDetails
          vault={vault}
          assets={assets}
          isPendingSigner={isPendingSigner}
          setAddAssetsDialogState={setAddAssetsDialogState}
        />

        <SignersDetails
          vault={vault}
          display={{ base: 'none', xs: !isLarge ? 'block' : 'none' }}
        />
      </HStack>
      <Box
        w="full"
        display="flex"
        flexDir={{ base: 'column', xs: isSmall ? 'column' : 'row' }}
        gap={4}
        mb={4}
      >
        <Box
          display="flex"
          flexDir={{ base: 'column', xs: isSmall ? 'column' : 'row' }}
          alignItems={{ base: 'start', xs: isSmall ? 'unset' : 'center' }}
          gap={isSmall ? 2 : 4}
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

        <TransactionTypeFilters
          currentFilter={txFilterType}
          incomingAction={handleIncomingAction}
          outgoingAction={handleOutgoingAction}
          buttonsFullWidth={isSmall}
        />
      </Box>

      <CustomSkeleton
        minH="30vh"
        isLoaded={!vault.isLoading && !isLoading}
        h={!vault.isLoading && !isLoading ? 'unset' : '100px'}
      >
        {hasTransactions
          ? transactions?.map((grouped, index) => {
              const isLastGroup = index === transactions.length - 1;
              return (
                <Box key={grouped.monthYear} w="full">
                  <TransactionCard.GroupMonth
                    monthYear={grouped.monthYear}
                    mb={!isMobile ? 3 : 0}
                    mt={!isMobile ? 0 : 3}
                  />
                  <TransactionCard.List
                    w="full"
                    maxH={{ base: undefined, sm: 'calc(100% - 72px)' }}
                    spacing={0}
                  >
                    {grouped?.transactions?.map((transaction) => (
                      <TransactionCard.Item
                        w="full"
                        key={transaction.id}
                        ref={transactionsRef}
                        isMobile={isMobile}
                        transaction={transaction}
                        userInfos={userInfos}
                      />
                    ))}

                    {isLastGroup &&
                      grouped.transactions.length >= 5 &&
                      isFetching && (
                        <Spinner alignSelf="center" mt={4} color="brand.500" />
                      )}
                  </TransactionCard.List>
                </Box>
              );
            })
          : !!transactions && (
              <EmptyState
                title="No Data available"
                subTitle="Currently, there is no available data to display in this section."
                showAction={false}
                mb={10}
              />
            )}
      </CustomSkeleton>

      {isLarge && (
        <Box mt={7}>
          <SignersDetails vault={vault} />
        </Box>
      )}
    </Box>
  );
};

export { VaultDetailsPage };
