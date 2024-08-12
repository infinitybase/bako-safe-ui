import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Icon,
  Progress,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { bn } from 'fuels';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

import { Pages } from '@/modules/core/routes';
import { assetsMap } from '@/modules/core/utils';

import { useMeTransactions } from '../../hooks/me/useMeTransactions';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const MeTransactionsPage = () => {
  const { transactionsRequest, navigate, calculateSignatures } =
    useMeTransactions();

  const {
    workspaceInfos: {
      handlers: { goHome },
    },
  } = useWorkspaceContext();

  return (
    <Card mb={4} bg="dark.500" minW={700} boxShadow="xl" minH={550}>
      <CardHeader>
        <Flex width="100%" alignItems="center">
          <Box pt={2}>
            <Icon
              onClick={() => goHome()}
              cursor="pointer"
              color="gray"
              fontSize="4xl"
              as={MdChevronLeft}
            />
          </Box>
          <Heading color="white" size="lg">
            Signatures
          </Heading>
        </Flex>
      </CardHeader>
      <CardBody hidden={!transactionsRequest.isLoading}>
        <Flex display="flex" justifyContent="center" alignItems="center">
          <Spinner color="brand.500" size="xl" />
        </Flex>
      </CardBody>

      <CardBody hidden={transactionsRequest.isLoading}>
        {transactionsRequest.transactions?.map((transaction) => {
          const assets = transaction.assets.reduce(
            (accumulator, asset) => {
              const { assetId, amount } = asset;
              const existingItem = accumulator.find(
                (item) => item.assetId === assetId,
              );
              if (existingItem) {
                existingItem.amount = bn
                  .parseUnits(amount.toString())
                  .add(bn.parseUnits(existingItem.amount))
                  .format();
              } else {
                accumulator.push({
                  ...asset,
                  amount: bn.parseUnits(amount.toString()).format(),
                });
              }
              return accumulator;
            },
            [] as typeof transaction.assets,
          );
          const isFullSigned =
            transaction?.resume?.witnesses?.length >=
            transaction.resume.requiredSigners;

          return (
            <Flex
              onClick={() =>
                navigate(
                  Pages.detailsTransaction({
                    vaultId: transaction.predicateId,
                    transactionId: transaction.id,
                  }),
                )
              }
              key={transaction.id}
              justifyContent="space-between"
              alignItems="center"
              py={2}
              px={3}
              mb={3}
              bg="dark.100"
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: 'dark.200' }}
            >
              <Box display="flex" flexWrap="wrap" flex={2}>
                <Box flex={1} mr={2}>
                  <Text color="white">
                    <Text fontSize="sm" color="gray">
                      Name:
                    </Text>
                    {transaction.name}
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text color="white">
                    <Text fontSize="sm" color="gray">
                      Predicate:
                    </Text>
                    {'transaction.predicate.name'}
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text fontSize="sm" color="gray">
                    Assets:
                  </Text>
                  <Box display="flex" flexDirection="column">
                    {assets.map((asset) => (
                      <Box key={`${asset.amount}${asset.to}`}>
                        <Badge backgroundColor="dark.500" color="gray">
                          {asset.amount} {assetsMap[asset.assetId].slug}{' '}
                        </Badge>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box flex={1}>
                  <Text fontSize="sm" color="gray">
                    You signed:
                  </Text>
                  <Badge
                    colorScheme={transaction.isSigned ? 'green' : 'yellow'}
                  >
                    {transaction.isSigned ? 'Yes' : 'No'}
                  </Badge>
                </Box>
                <Box mt={5} w="100%">
                  <Box mb={2}>
                    <Text fontSize="sm" color="gray">
                      Signatures ({transaction.resume.witnesses.length}/
                      {transaction.resume.requiredSigners}):
                    </Text>
                  </Box>
                  <Progress
                    min={0}
                    max={100}
                    value={calculateSignatures(
                      transaction.resume.witnesses.length,
                      transaction.resume.requiredSigners,
                    )}
                    backgroundColor="gray"
                    colorScheme={isFullSigned ? 'brand' : 'yellow'}
                    size="sm"
                  />
                </Box>
              </Box>

              <Box display="flex" alignItems="center">
                <Icon color="gray" fontSize="xl" as={MdChevronRight} />
              </Box>
            </Flex>
          );
        })}
        {!transactionsRequest.transactions?.length && (
          <Flex
            flexDirection="column"
            textAlign="center"
            justifyContent="center"
            w="100%"
          >
            <Box mb={4}>
              <Text color="white">Not found signatures.</Text>
            </Box>
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};

export { MeTransactionsPage };
