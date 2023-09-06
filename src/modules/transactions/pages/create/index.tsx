import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Icon,
  Input,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';
import { MdAdd as AddIcon, MdChevronLeft } from 'react-icons/md';
import { TbTrash as RemoveIcon } from 'react-icons/tb';

import { AmountInput } from '@/components';
import { AssetSelect } from '@/modules/transactions/components';
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
        <form onSubmit={form.handleCreateTransaction}>
          <Box mb={2}>
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel color="gray">Name</FormLabel>
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    variant="filled"
                    bg="dark.100"
                    color="gray"
                  />
                </FormControl>
              )}
            />
          </Box>
          <Divider opacity="0.2" mb={3} mt={3} />
          {transactionsFields.fields.map((transaction, index) => {
            const asset = form.watch(`transactions.${index}.asset`);

            return (
              <React.Fragment key={transaction.id}>
                <Box mb={2}>
                  <Controller
                    name={`transactions.${index}.to`}
                    control={form.control}
                    render={({ field }) => (
                      <FormControl>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            flexDirection: 'row',
                          }}
                        >
                          <FormLabel color="gray">To</FormLabel>
                          {index > 0 && (
                            <Icon
                              as={RemoveIcon}
                              fontSize="md"
                              color="red.400"
                              cursor="pointer"
                              onClick={() => transactionsFields.remove(index)}
                            />
                          )}
                        </div>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          variant="filled"
                          bg="dark.100"
                          color="gray"
                          _hover={{}}
                        />
                      </FormControl>
                    )}
                  />
                </Box>
                <Box mb={2}>
                  <Controller
                    name={`transactions.${index}.asset`}
                    control={form.control}
                    render={({ field }) => (
                      <AssetSelect
                        assets={assets.assets}
                        name={`transaction.${index}.asset`}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </Box>
                <Grid mb={4}>
                  <Controller
                    name={`transactions.${index}.amount`}
                    control={form.control}
                    render={({ field }) => (
                      <FormControl>
                        <FormLabel color="gray">Amount</FormLabel>
                        <AmountInput
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormHelperText>
                          {asset && (
                            <Text>
                              Balance: {assets.getAssetInfo(asset)?.slug}{' '}
                              {assets.getCoinBalance(asset)}
                            </Text>
                          )}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Divider opacity="0.2" mb={3} />
              </React.Fragment>
            );
          })}

          <Button
            mt={8}
            width="100%"
            color="grey"
            bgColor="dark.100"
            leftIcon={<Icon as={AddIcon} />}
            _hover={{}}
            _active={{}}
            onClick={() =>
              transactionsFields.append({ amount: '', asset: '', to: '' })
            }
          >
            Add Transaction
          </Button>

          <Button
            mt={4}
            w="100%"
            color="brand.900"
            variant="solid"
            colorScheme="brand"
            type="submit"
            isDisabled={!form.formState.isValid}
            isLoading={transactionRequest.isLoading}
          >
            Create
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export { CreateTransactionPage };
