import {
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  CircularProgress,
  Heading,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';

import {
  Card,
  CustomSkeleton,
  HomeIcon,
  NotFoundIcon,
  PendingIcon,
  SquarePlusIcon,
} from '@/components';
import {
  Pages,
  TransactionCard,
  transactionStatus,
  waitingSignatures,
} from '@/modules';
import { useTemplateStore } from '@/modules/template/store/useTemplateStore';
import { useVaultDetails } from '@/modules/vault/hooks';
import { limitCharacters } from '@/utils';

import { AmountDetails } from '../../components/AmountDetails';
import { CardDetails } from '../../components/CardDetails';
import { SignersDetails } from '../../components/SignersDetails';

const VaultDetailsPage = () => {
  const { setTemplateFormInitial } = useTemplateStore();
  const { vault, store, assets, navigate, account, inView } = useVaultDetails();
  const { vaultTransactions, loadingVaultTransactions } = vault.transactions;

  const hasTransactions =
    !loadingVaultTransactions && vaultTransactions?.length;

  if (!vault) return null;

  return (
    <Box w="full">
      <HStack mb={9} w="full" justifyContent="space-between">
        <Breadcrumb>
          <BreadcrumbItem>
            <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
            <BreadcrumbLink
              fontSize="sm"
              color="grey.200"
              fontWeight="semibold"
              onClick={() => navigate(Pages.home())}
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink
              fontSize="sm"
              color="grey.200"
              fontWeight="semibold"
              onClick={() => navigate(Pages.userVaults())}
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
            >
              {vault.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Button
          variant="secondary"
          bgColor="dark.100"
          border="none"
          onClick={() => {
            setTemplateFormInitial({
              minSigners: vault.minSigners!,
              addresses:
                vault.signers! && vault.signers.map((signer) => signer.address),
            });
            navigate(
              Pages.createTemplate({
                vaultId: vault.id!,
              }),
            );
          }}
        >
          Set as template
        </Button>
      </HStack>

      <HStack mb={14} alignItems="flex-start" w="full" spacing={5}>
        <CardDetails vault={vault} store={store} />
        <AmountDetails
          store={store}
          vaultAddress={vault.predicateAddress!}
          assets={assets}
          isLoading={vault.isLoading}
        />
        <SignersDetails vault={vault} />
      </HStack>

      <HStack spacing={4} mb={3}>
        <Text
          variant="subtitle"
          fontWeight="semibold"
          fontSize="xl"
          color="grey.200"
        >
          Transactions
        </Text>
        <CircularProgress
          size="20px"
          trackColor="dark.100"
          color="brand.500"
          isIndeterminate
          hidden={!vault.transactions.isFetching}
        />
        <Badge hidden={vault.transactions.isFetching} h={6} variant="warning">
          <Icon as={PendingIcon} />
          {`${waitingSignatures({
            account,
            transactions: vaultTransactions ?? [],
          })} waiting for your signature`}
        </Badge>
      </HStack>

      {hasTransactions ? (
        <TransactionCard.List
          mt={7}
          w="full"
          spacing={5}
          maxH="calc(100% - 82px)"
        >
          {vaultTransactions.map((transaction) => (
            <CustomSkeleton
              key={transaction.id}
              isLoaded={!loadingVaultTransactions}
            >
              <TransactionCard.Container
                status={transactionStatus({ ...transaction, account })}
                details={<TransactionCard.Details transaction={transaction} />}
              >
                <TransactionCard.CreationDate>
                  {format(new Date(transaction.createdAt), 'EEE, dd MMM')}
                </TransactionCard.CreationDate>
                <TransactionCard.Assets />
                <TransactionCard.Amount assets={transaction.assets} />
                <TransactionCard.Name>
                  {limitCharacters(transaction.name, 20)}
                </TransactionCard.Name>
                <TransactionCard.Status
                  transaction={transaction}
                  status={transactionStatus({ ...transaction, account })}
                />
                <TransactionCard.Actions
                  transaction={transaction}
                  status={transactionStatus({ ...transaction, account })}
                />
              </TransactionCard.Container>
            </CustomSkeleton>
          ))}
          {!vault.transactions.isLoading && <Box ref={inView.ref} />}
        </TransactionCard.List>
      ) : (
        !loadingVaultTransactions && (
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
              <Heading color="brand.500" fontSize="4xl">
                Anything to show here.
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
                navigate(Pages.createTransaction({ vaultId: vault.id! }))
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
