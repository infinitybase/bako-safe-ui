import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { RiMenuUnfoldLine } from 'react-icons/ri';

import { CustomSkeleton, HomeIcon } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { Drawer } from '@/layouts/dashboard/drawer';
import { useAuth } from '@/modules/auth';
import { PermissionRoles } from '@/modules/core';
import { useScreenSize } from '@/modules/core/hooks';
import { Pages } from '@/modules/core/routes';
import { useHome } from '@/modules/home/hooks/useHome';
import { useTemplateStore } from '@/modules/template/store/useTemplateStore';
import {
  TransactionCard,
  transactionStatus,
  WaitingSignatureBadge,
} from '@/modules/transactions';
import { useVaultDetails } from '@/modules/vault/hooks/details/useVaultDetails';
import { useGetCurrentWorkspace } from '@/modules/workspace';
import { useWorkspace } from '@/modules/workspace/hooks/useWorkspace';
import { limitCharacters } from '@/utils/limit-characters';

import { CardDetails } from '../../components/CardDetails';
import { SignersDetails } from '../../components/SignersDetails';

const VaultDetailsPage = () => {
  const { setTemplateFormInitial } = useTemplateStore();
  const {
    params,
    vault,
    store,
    navigate,
    account,
    inView,
    pendingSignerTransactions,
    menuDrawer,
  } = useVaultDetails();
  const { goWorkspace, hasPermission } = useWorkspace();
  const { workspace } = useGetCurrentWorkspace();

  const { vaultTransactions, loadingVaultTransactions, isLoading } =
    vault.transactions;
  const { goHome } = useHome();
  const {
    workspaces: { current },
  } = useAuth();
  const { vaultRequiredSizeToColumnLayout, isExtraSmall } = useScreenSize();

  const workspaceId = current ?? '';
  const hasTransactions =
    !loadingVaultTransactions && vaultTransactions?.length;

  const { OWNER, SIGNER } = PermissionRoles;

  const canSetTemplate = hasPermission([SIGNER]) || hasPermission([OWNER]);

  if (!vault) return null;

  return (
    <Box w="full">
      <Drawer isOpen={menuDrawer.isOpen} onClose={menuDrawer.onClose} />

      <HStack mb={9} w="full" justifyContent="space-between">
        {vaultRequiredSizeToColumnLayout ? (
          <HStack gap={1.5} onClick={menuDrawer.onOpen}>
            <Icon as={RiMenuUnfoldLine} fontSize="xl" color="grey.200" />
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

            {!workspace?.single && (
              <BreadcrumbItem>
                <BreadcrumbLink
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() => goWorkspace(workspaceId)}
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
                {limitCharacters(vault?.name ?? '', 25)}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        )}
        <Button
          color="dark.200"
          bgColor="grey.200"
          fontWeight="medium"
          fontSize={{ base: 'sm', sm: 'md' }}
          border="none"
          isDisabled={!canSetTemplate}
          onClick={() => {
            if (
              !vault.id ||
              !vault.minSigners ||
              !vault.members ||
              !params.workspaceId
            )
              return;
            setTemplateFormInitial({
              minSigners: vault.minSigners!,
              addresses:
                vault.members! && vault.members.map((signer) => signer.address),
            });
            navigate(
              Pages.createTemplate({
                vaultId: vault.id!,
                workspaceId: params.workspaceId!,
              }),
            );
          }}
        >
          Set as template
        </Button>
      </HStack>

      <HStack
        mb={{ base: 10, sm: 14 }}
        alignItems="flex-start"
        w="full"
        gap={10}
        h={453}
      >
        <CardDetails vault={vault} store={store} />

        {!vaultRequiredSizeToColumnLayout && <SignersDetails vault={vault} />}
      </HStack>

      <Box
        mb={3}
        display="flex"
        alignItems={isExtraSmall ? 'flex-start' : 'center'}
        flexDir={isExtraSmall ? 'column' : 'row'}
        gap={isExtraSmall ? 2 : 4}
        mt={{ base: 12, sm: 'unset' }}
      >
        <Text
          variant="subtitle"
          fontWeight="semibold"
          fontSize={{ base: 'md', sm: 'xl' }}
          color="grey.400"
        >
          Transactions
        </Text>
        <WaitingSignatureBadge
          isLoading={pendingSignerTransactions.isLoading}
          quantity={pendingSignerTransactions.data?.ofUser ?? 0}
        />
      </Box>
      <CustomSkeleton
        isLoaded={!vault.isLoading && !isLoading && !loadingVaultTransactions}
        h="full"
      >
        {hasTransactions ? (
          <TransactionCard.List
            mt={5}
            w="full"
            spacing={{ base: 3, sm: 5 }}
            maxH={{ base: undefined, sm: 'calc(100% - 82px)' }}
          >
            {vaultTransactions.map((transaction) => {
              const isSigner = !!transaction.predicate?.members?.find(
                (member) => member.address === account,
              );

              return (
                <CustomSkeleton
                  key={transaction.id}
                  isLoaded={!loadingVaultTransactions}
                >
                  <TransactionCard.Container
                    status={transactionStatus({ ...transaction, account })}
                    details={
                      <TransactionCard.Details
                        transaction={transaction}
                        isInTheVaultPage
                      />
                    }
                    isInTheVaultPage
                    transaction={transaction}
                    account={account}
                    isSigner={isSigner}
                  >
                    {/* {!vaultRequiredSizeToColumnLayout && (
                      <TransactionCard.CreationDate>
                        {format(
                          new Date(transaction?.createdAt),
                          'EEE, dd MMM',
                        )}
                      </TransactionCard.CreationDate>
                    )} */}

                    <TransactionCard.Assets />
                    <TransactionCard.Amount
                      assets={
                        transaction?.assets.map((asset) => ({
                          amount: asset.amount,
                          assetId: asset.assetId,
                          to: asset.to,
                        })) ?? []
                      }
                    />
                    <TransactionCard.Name vaultName={transaction.name} />
                    <TransactionCard.Status
                      transaction={transaction}
                      status={transactionStatus({
                        ...transaction,
                        account,
                      })}
                      showDescription={!vaultRequiredSizeToColumnLayout}
                    />
                    <TransactionCard.Actions
                      isSigner={isSigner}
                      transaction={transaction}
                      status={transactionStatus({
                        ...transaction,
                        account,
                      })}
                      isInTheVaultPage
                    />
                  </TransactionCard.Container>
                </CustomSkeleton>
              );
            })}
            {!vault.transactions.isLoading && <Box ref={inView.ref} />}
          </TransactionCard.List>
        ) : (
          !hasTransactions &&
          !!vaultTransactions && (
            <EmptyState
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
          )
        )}
      </CustomSkeleton>

      {vaultRequiredSizeToColumnLayout && (
        <Box mt={7}>
          <SignersDetails vault={vault} />
        </Box>
      )}
    </Box>
  );
};

export { VaultDetailsPage };
