import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { RiMenuUnfoldLine } from 'react-icons/ri';

import {
  Card,
  CustomSkeleton,
  HomeIcon,
  NotFoundIcon,
  SquarePlusIcon,
} from '@/components';
import { useAuth } from '@/modules/auth';
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
  } = useVaultDetails();
  const { goWorkspace } = useWorkspace();
  const { vaultTransactions, loadingVaultTransactions } = vault.transactions;
  const { goHome } = useHome();
  const {
    workspaces: { current },
  } = useAuth();
  const { workspace } = useGetCurrentWorkspace();
  const { isMobile } = useScreenSize();

  const workspaceId = current ?? '';
  const hasTransactions =
    !loadingVaultTransactions && vaultTransactions?.length;

  if (!vault) return null;

  return (
    <Box w="full" pr={{ base: 0, sm: 8 }}>
      <HStack mb={9} w="full" justifyContent="space-between">
        {isMobile ? (
          <HStack gap={1.5}>
            <Icon as={RiMenuUnfoldLine} fontSize="xl" color="grey.200" />
            <Text fontSize="sm" fontWeight="normal" color="grey.100">
              Menu
            </Text>
          </HStack>
        ) : (
          <Breadcrumb>
            <BreadcrumbItem>
              <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() => goHome()}
              >
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
                {vault.name}
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

      <Flex
        mb={{ base: 10, sm: 14 }}
        flexDirection={{ base: 'column', sm: 'row' }}
        alignItems="flex-start"
        w="full"
        gap={10}
      >
        <CardDetails vault={vault} store={store} />

        <SignersDetails vault={vault} />
      </Flex>

      <HStack spacing={4} mb={3}>
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
      </HStack>

      {hasTransactions ? (
        <TransactionCard.List
          mt={5}
          w="full"
          spacing={5}
          maxH="calc(100% - 82px)"
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
                    <TransactionCard.Details transaction={transaction} />
                  }
                >
                  <TransactionCard.CreationDate>
                    {format(new Date(transaction?.createdAt), 'EEE, dd MMM')}
                  </TransactionCard.CreationDate>
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
                  <TransactionCard.Name>
                    {limitCharacters(transaction?.name ?? '', 20)}
                  </TransactionCard.Name>
                  <TransactionCard.Status
                    transaction={transaction}
                    status={transactionStatus({ ...transaction, account })}
                  />
                  <TransactionCard.Actions
                    isSigner={isSigner}
                    transaction={transaction}
                    status={transactionStatus({ ...transaction, account })}
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
          <Card
            w="full"
            p={20}
            bgColor="dark.300"
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            <Box mb={6}>
              <NotFoundIcon w={100} h={100} />
            </Box>
            <Box mb={5}>
              <Heading color="brand.500" fontSize="4xl" textAlign="center">
                Nothing to show here.
              </Heading>
            </Box>
            <Box maxW={400} mb={8}>
              <Text
                color="white"
                fontSize="md"
                textAlign="center"
                fontWeight="bold"
              >
                It seems like you {"haven't"} made any transactions yet. Would
                you like to make one now?
              </Text>
            </Box>
            <Button
              variant="primary"
              leftIcon={<SquarePlusIcon />}
              isDisabled={!vault?.hasBalance}
              onClick={() =>
                navigate(
                  Pages.createTransaction({
                    workspaceId: params.workspaceId!,
                    vaultId: vault.id!,
                  }),
                )
              }
            >
              Create transaction
            </Button>
          </Card>
        )
      )}
    </Box>
  );
};

export { VaultDetailsPage };
