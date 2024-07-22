import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
  HStack,
  Icon,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { RiMenuUnfoldLine } from 'react-icons/ri';

import { CustomSkeleton, HomeIcon, TransactionTypeFilters } from '@/components';
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
  TransactionCardMobile,
  transactionStatus,
  WaitingSignatureBadge,
} from '@/modules/transactions';
import { useGetCurrentWorkspace } from '@/modules/workspace';
import { useWorkspace } from '@/modules/workspace/hooks/useWorkspace';
import { limitCharacters } from '@/utils/limit-characters';

import { CardDetails } from '../../components/CardDetails';
import { SignersDetails } from '../../components/SignersDetails';
import { useVaultInfosContext } from '../../providers/VaultInfosProvider';

const VaultDetailsPage = () => {
  const {
    params,
    vault,
    assets,
    store,
    navigate,
    account,
    inView,
    pendingSignerTransactions,
    menuDrawer,
  } = useVaultInfosContext();

  const { setTemplateFormInitial } = useTemplateStore();
  const { goWorkspace, hasPermission } = useWorkspace();
  const { workspace } = useGetCurrentWorkspace();

  const { vaultTransactions, loadingVaultTransactions, isLoading } =
    vault.transactions;
  const { goHome } = useHome();
  const {
    workspaces: { current },
  } = useAuth();
  const { vaultRequiredSizeToColumnLayout, isSmall, isMobile, isLarge } =
    useScreenSize();

  const workspaceId = current ?? '';
  const hasTransactions =
    !loadingVaultTransactions && vaultTransactions?.data?.length;

  const { OWNER, SIGNER } = PermissionRoles;

  const canSetTemplate = hasPermission([SIGNER]) || hasPermission([OWNER]);

  const hideSetTemplateButton = true;

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
                !vault.id ||
                !vault.minSigners ||
                !vault.members ||
                !params.workspaceId
              )
                return;
              setTemplateFormInitial({
                minSigners: vault.minSigners!,
                addresses:
                  vault.members! &&
                  vault.members.map((signer) => signer.address),
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
        )}
      </HStack>

      <HStack
        mb={{ base: 10, sm: 14 }}
        alignItems="flex-start"
        w="full"
        gap={10}
      >
        <CardDetails vault={vault} store={store} assets={assets} />

        {!isLarge && <SignersDetails vault={vault} />}
      </HStack>
      <Box
        w="full"
        display="flex"
        flexDir={isSmall ? 'column' : 'row'}
        gap={4}
        mb={4}
      >
        <Box
          display="flex"
          flexDir={isSmall ? 'column' : 'row'}
          alignItems={isSmall ? 'unset' : 'center'}
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
          incomingAction={vault.transactions.handleIncomingAction}
          outgoingAction={vault.transactions.handleOutgoingAction}
          buttonsFullWidth={isSmall}
        />
      </Box>

      <CustomSkeleton
        minH="30vh"
        isLoaded={!vault.isLoading && !isLoading && !loadingVaultTransactions}
        h={
          !vault.isLoading && !isLoading && !loadingVaultTransactions
            ? 'unset'
            : '100px'
        }
      >
        {hasTransactions
          ? vaultTransactions.data.map((grouped) => (
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
                <TransactionCard.List
                  mt={5}
                  w="full"
                  maxH={{ base: undefined, sm: 'calc(100% - 82px)' }}
                  spacing={0}
                >
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
                        {isMobile ? (
                          <TransactionCardMobile
                            isSigner={isSigner}
                            transaction={transaction}
                            account={account}
                            mt={2.5}
                            w="full"
                          />
                        ) : (
                          <TransactionCard.Container
                            mb={2.5}
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

                        {!vault.transactions.isLoading && (
                          <Box ref={inView.ref} />
                        )}
                      </>
                    );
                  })}
                </TransactionCard.List>
              </>
            ))
          : !hasTransactions &&
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
