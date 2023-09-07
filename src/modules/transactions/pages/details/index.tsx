import {
  Box,
  Card,
  CardHeader,
  Flex,
  Heading,
  Icon,
  Text,
} from '@chakra-ui/react';
import { MdChevronLeft } from 'react-icons/md';

import { Loader } from '@/components';
import { Pages } from '@/modules';
import { useTransactionDetails } from '@/modules/transactions/hooks';

const DetailsTransactionPage = () => {
  const {
    params,
    navigate,
    transactionData,
    transactionDetailRequest,
    vaultDetailsRequest,
  } = useTransactionDetails();

  return (
    <Card bg="dark.500" minW={400} boxShadow="xl">
      {!transactionData &&
      transactionDetailRequest.isLoading &&
      !vaultDetailsRequest.predicate?._id ? (
        <Loader w={550} h={500} />
      ) : (
        <>
          <CardHeader>
            <Flex width="100%" alignItems="center">
              <Icon
                onClick={() =>
                  navigate(Pages.transactions({ id: params.vaultId! }))
                }
                cursor="pointer"
                color="gray"
                fontSize="4xl"
                as={MdChevronLeft}
              />
              <Heading color="white" size="lg">
                {transactionDetailRequest.data?.name}
              </Heading>
            </Flex>
            <Box mr={2} mt={2} maxW={550}>
              <Text fontSize="sm" color="gray">
                Check out the details and click on “Confirm” to sign the
                transaction. You can also see the status of your members
                signatures. The transaction will be executed when it completes
                the minimum number of signatures.
              </Text>
            </Box>
          </CardHeader>
          {/*<BodyTransactionDetails*/}
          {/*  transferData={_transferData as TransactionDetailUI}*/}
          {/*  transaction={transaction as GetTransactionResponse}*/}
          {/*  signin={signinTransaction}*/}
          {/*  isLoading={isLoadingTransfer}*/}
          {/*  isLoadingRequest={isLoading}*/}
          {/*/>*/}
        </>
      )}
    </Card>
  );
};

export { DetailsTransactionPage };
