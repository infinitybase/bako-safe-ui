import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Icon,
  Text,
} from '@chakra-ui/react';
import { MdChevronLeft } from 'react-icons/md';

import { CreateTransactionForm } from '@/modules/transactions/components';
import { useCreateTransaction } from '@/modules/transactions/hooks';

const CreateTransactionPage = () => {
  const { transactionsFields, transactionRequest, form, assets, navigate } =
    useCreateTransaction();

  return (
    <Card bg="dark.500" width="100%" maxWidth={400} boxShadow="xl">
      <CardHeader>
        <Flex width="100%" alignItems="center" justifyContent="space-between">
          <Box display="flex">
            <Box>
              <Icon
                onClick={() => navigate(-1)}
                cursor="pointer"
                color="gray"
                fontSize="4xl"
                as={MdChevronLeft}
              />
            </Box>
            <Heading color="white" size="lg">
              Transaction
            </Heading>
          </Box>

          <Button
            size="xs"
            color="brand.900"
            variant="solid"
            colorScheme="brand"
            loadingText="Connecting.."
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </Flex>
        <Box mr={2} mt={2} maxW={500}>
          <Text fontSize="sm" color="gray">
            Complete the info to create your transaction. You can send to
            different addresses using the button {'"Add a transaction"'} and
            select the asset and amount of your choice.
          </Text>
        </Box>
      </CardHeader>

      <CardBody>
        <CreateTransactionForm
          form={form}
          assets={assets}
          isCreating={transactionRequest.isLoading}
          transactionsFields={transactionsFields}
        />
      </CardBody>
    </Card>
  );
};

export { CreateTransactionPage };
