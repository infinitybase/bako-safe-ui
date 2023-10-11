import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  Link,
  Skeleton,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { CgList } from 'react-icons/cg';
import { FaRegPlusSquare } from 'react-icons/fa';
import { GoArrowSwitch } from 'react-icons/go';

import { HomeIcon, PendingIcon, VaultIcon } from '@/components';
import { Pages } from '@/modules';
import {
  TransactionCard,
  transactionStatus,
  waitingSignatures,
} from '@/modules/transactions';
import { ExtraVaultCard, VaultCard } from '@/modules/vault';
import { limitCharacters } from '@/utils';

import { useHome } from '..';
import { ActionCard } from '../components/ActionCard';

const HomePage = () => {
  const {
    vaultsRequest: {
      vaults: { recentVaults, extraCount, vaultsMax },
      isLoading: loadingRecentVaults,
    },
    transactionsRequest: { transactions },
    account,
    navigate,
  } = useHome();

  return (
    <VStack w="full" spacing={6}>
      <HStack w="full" h="10" justifyContent="space-between">
        <HStack>
          <Icon as={HomeIcon} fontSize="lg" color="grey.200" />
          <Text color="grey.200" fontWeight="semibold">
            Home
          </Text>
        </HStack>

        <Box>
          <Button
            variant="primary"
            fontWeight="bold"
            leftIcon={<FaRegPlusSquare />}
            onClick={() => navigate(Pages.createVault())}
          >
            Create vault
          </Button>
        </Box>
      </HStack>

      <HStack spacing={6}>
        <ActionCard.Container onClick={() => navigate(Pages.userVaults())}>
          <ActionCard.Icon icon={VaultIcon} />
          <Box>
            <ActionCard.Title>Vaults</ActionCard.Title>
            <ActionCard.Description>
              Access and Manage All Your Vaults in One Place.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>

        <ActionCard.Container onClick={() => navigate(Pages.transactions())}>
          <ActionCard.Icon icon={GoArrowSwitch} />
          <Box>
            <ActionCard.Title>Transactions</ActionCard.Title>
            <ActionCard.Description>
              Manage Transactions Across All Vaults in One Place.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>

        <ActionCard.Container isUpcoming={true}>
          <ActionCard.Icon icon={CgList} isUpcoming={true} />
          <Box>
            <ActionCard.Title isUpcoming={true}>Address book</ActionCard.Title>
            <ActionCard.Description>
              Access and Manage Your Contacts for Easy Transfers and Vault
              Creation.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>
      </HStack>

      {/* RECENT VAULTS */}
      <Box mt={4} alignSelf="flex-start">
        <Text
          variant="subtitle"
          fontWeight="semibold"
          fontSize="xl"
          color="grey.200"
        >
          Recently used vaults
        </Text>
      </Box>
      <Grid w="full" templateColumns="repeat(4, 1fr)" gap={6}>
        {recentVaults?.map(
          ({ id, name, predicateAddress, addresses, description }, index) => {
            const lastCard = index === vaultsMax - 1;
            const hasMore = extraCount > 0;

            return (
              <GridItem key={id}>
                <Skeleton
                  speed={1}
                  startColor="dark.200"
                  endColor="dark.500"
                  isLoaded={!loadingRecentVaults}
                  w="100%"
                  borderRadius={10}
                >
                  {lastCard && hasMore ? (
                    <ExtraVaultCard
                      extra={extraCount}
                      onClick={() => navigate(Pages.userVaults())}
                    />
                  ) : (
                    <VaultCard
                      name={name}
                      title={description}
                      address={predicateAddress}
                      members={addresses}
                      onClick={() =>
                        navigate(Pages.detailsVault({ vaultId: id }))
                      }
                    />
                  )}
                </Skeleton>
              </GridItem>
            );
          },
        )}
      </Grid>

      {/* TRANSACTION LIST */}
      <Box w="full" mt={8}>
        <HStack spacing={4}>
          <Text
            variant="subtitle"
            fontWeight="semibold"
            fontSize="xl"
            color="grey.200"
          >
            Transactions
          </Text>
          <Badge h={6} variant="warning">
            <Icon as={PendingIcon} />
            {`${waitingSignatures({
              account,
              transactions: transactions ?? [],
            })} waiting for your signature`}
          </Badge>
          <Spacer />
          <Link color="brand.500">View all</Link>
        </HStack>

        <TransactionCard.List spacing={4} mt={6} mb={12}>
          {transactions?.map((transaction) => {
            return (
              <TransactionCard.Container
                status={transactionStatus({ ...transaction, account })}
                key={transaction.id}
                details={<TransactionCard.Details transaction={transaction} />}
              >
                <TransactionCard.VaultInfo vault={transaction.predicate} />
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
            );
          })}
        </TransactionCard.List>
      </Box>
    </VStack>
  );
};

export { HomePage };
