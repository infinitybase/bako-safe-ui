import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Icon,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { MdChevronLeft } from 'react-icons/md';

import { Loader } from '@/components';
import { Pages } from '@/modules';

import { TransactionItem } from '../../components';
import { useTransactionList } from '../../hooks';

const TransactionsVaultPage = () => {
  const { transactionRequest, vaultRequest, navigate, params } =
    useTransactionList();

  return (
    <Card bg="dark.500" color="white" minW={600} boxShadow="xl">
      {transactionRequest.isLoading ? (
        <Loader w={600} h={400} />
      ) : (
        <>
          <CardHeader>
            <Flex width="100%" justifyContent="space-between">
              <Flex alignItems="center">
                <Icon
                  onClick={() =>
                    navigate(
                      Pages.detailsVault({
                        id: params.id!,
                      }),
                    )
                  }
                  cursor="pointer"
                  color="gray"
                  fontSize="4xl"
                  as={MdChevronLeft}
                />
                <Heading size="lg">Transactions</Heading>
              </Flex>
              {!!transactionRequest.transactions?.length && (
                <Button
                  size="xs"
                  color="brand.900"
                  variant="solid"
                  colorScheme="brand"
                  loadingText="Connecting.."
                  onClick={() => navigate(Pages.example())}
                >
                  Create
                </Button>
              )}
            </Flex>
            <Box mr={2} mt={2} maxW={500}>
              <Text fontSize="sm" color="gray">
                Track your transactions here and click on one to see its details
              </Text>
            </Box>
          </CardHeader>
          <CardBody>
            {!transactionRequest.transactions?.length ? (
              <Flex
                flexDirection="column"
                textAlign="center"
                justifyContent="center"
                w="100%"
              >
                {transactionRequest.isLoading ? (
                  <Flex
                    w="100%"
                    justifyContent="center"
                    alignItems="center"
                    minH={500}
                    minW={550}
                  >
                    <Spinner color="brand.500" size="xl" />
                  </Flex>
                ) : (
                  <>
                    <Box mb={4}>
                      <Text>Not found transactions.</Text>
                    </Box>
                    <Button
                      color="brand.900"
                      variant="solid"
                      colorScheme="brand"
                      loadingText="Connecting.."
                      onClick={() => navigate(Pages.example())}
                    >
                      Create
                    </Button>
                  </>
                )}
              </Flex>
            ) : (
              <Box w="100%">
                {transactionRequest.transactions?.map((item) => (
                  <TransactionItem
                    key={item._id}
                    assets={item.assets}
                    transaction={{
                      ...item,
                      predicate: vaultRequest.predicate,
                    }}
                    hidePredicateName
                  />
                ))}
              </Box>
            )}
          </CardBody>
        </>
      )}
    </Card>
  );
};

export { TransactionsVaultPage };
