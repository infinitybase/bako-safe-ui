import {
  Accordion,
  AccordionItem,
  Button,
  Center,
  HStack,
  Text,
} from '@chakra-ui/react';
import { UserAddIcon } from '@bako-safe/ui/components';

import { AddressUtils, delay, NativeAssetId } from '@/modules/core';
import { UseCreateTransaction } from '@/modules/transactions/hooks';
import { UseVaultDetailsReturn } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { TransactionAccordion } from './accordion';
import { TransactionFormField } from './transactionFormField';

interface TransactionAccordionProps {
  form: UseCreateTransaction['form'];
  nicks: UseCreateTransaction['nicks'];
  assets: UseVaultDetailsReturn['assets'];
  accordion: UseCreateTransaction['accordion'];
  transactions: UseCreateTransaction['transactionsFields'];
  isFeeCalcLoading: boolean;
  getBalanceAvailable: UseCreateTransaction['getBalanceAvailable'];
}

const TransactionAccordions = (props: TransactionAccordionProps) => {
  const {
    form,
    transactions,
    assets,
    accordion,
    nicks,
    isFeeCalcLoading,
    getBalanceAvailable,
  } = props;

  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  // Logic to fix the button in the footer
  // const accordionHeight = () => {
  //   if (isMobile && isLargerThan900) return 500;
  //   if (isMobile && isLargerThan768) return 400;
  //   if (isMobile && isLargerThan660) return 220;
  //   if (isMobile && isLargerThan600) return 200;

  //   return 450;
  // };

  return (
    <Accordion
      index={accordion.index}
      overflowY="auto"
      pb={isMobile ? 10 : 0}
      // maxH={accordionHeight()}
      maxH={450}
      pr={{ base: 1, sm: 0 }}
      sx={{
        '&::-webkit-scrollbar': {
          width: '5px',
          maxHeight: '330px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#2C2C2C',
          borderRadius: '30px',
          height: '10px' /* Adjust the height of the scrollbar thumb */,
        },
      }}
    >
      {transactions.fields.map((field, index) => {
        const transaction = form.watch(`transactions.${index}`);
        const assetSlug = assets.getAssetInfo(transaction.asset)?.slug;
        const fieldState = form.getFieldState(`transactions.${index}`);

        const hasEmptyField = Object.values(transaction).some(
          (value) => value === '',
        );

        const currentAmount = form.watch(`transactions.${index}.amount`);
        const isCurrentAmountZero = Number(currentAmount) === 0;

        const isDisabled =
          hasEmptyField || fieldState.invalid || isCurrentAmountZero;
        const contact = nicks.find(
          (nick) => nick.user.address === transaction.value,
        );

        return (
          <>
            <AccordionItem
              key={field.id}
              mb={6}
              borderWidth={1}
              borderColor="grey.925"
              borderRadius={10}
              backgroundColor="dark.950"
            >
              <TransactionAccordion.Item
                title={`Recipient ${index + 1}`}
                actions={
                  <TransactionAccordion.Actions>
                    <HStack spacing={4}>
                      <TransactionAccordion.EditAction
                        onClick={() => accordion.open(index)}
                      />
                      <TransactionAccordion.DeleteAction
                        isDisabled={props.transactions.fields.length === 1}
                        onClick={() => {
                          transactions.remove(index);
                          accordion.close();
                        }}
                      />
                    </HStack>
                    <TransactionAccordion.ConfirmAction
                      onClick={() => accordion.close()}
                      isDisabled={isDisabled}
                      isLoading={
                        !isCurrentAmountZero ? isFeeCalcLoading : false
                      }
                    />
                  </TransactionAccordion.Actions>
                }
                resume={
                  !hasEmptyField && (
                    <Text fontSize="sm" color="grey.500" mt={2}>
                      <b>
                        {transaction.amount} {assetSlug}
                      </b>{' '}
                      to{' '}
                      <b>
                        {' '}
                        {contact?.nickname ??
                          AddressUtils.format(transaction.value)}
                      </b>
                    </Text>
                  )
                }
              >
                <TransactionFormField
                  index={index}
                  form={form}
                  assets={assets}
                  isFeeCalcLoading={isFeeCalcLoading}
                  getBalanceAvailable={getBalanceAvailable}
                />
              </TransactionAccordion.Item>
            </AccordionItem>
          </>
        );
      })}
      <Center mt={6}>
        <Button
          w="full"
          leftIcon={<UserAddIcon />}
          variant="primary"
          bgColor="grey.200"
          border="none"
          _hover={{
            opacity: 0.8,
          }}
          onClick={() => {
            transactions.append({
              amount: '',
              asset: NativeAssetId,
              value: '',
            });
            delay(() => accordion.open(transactions.fields.length), 100);
          }}
        >
          Add more recipients
        </Button>
      </Center>
    </Accordion>
  );
};

export { TransactionAccordions };
