import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';

import { Dialog, DialogModalProps } from '@/components';
import { TooltipIcon } from '@/components/icons/tooltip';
import { useVerifyBrowserType } from '@/modules/dapp/hooks';
import { useCreateTransaction } from '@/modules/transactions/hooks';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';

export enum ECreateTransactionMethods {
  CREATE = 'Create',
  CREATE_AND_SIGN = 'Create and sign',
}

import { useState } from 'react';

import { CreateTransactionForm } from './form';

const CreateTransactionDialog = (props: Omit<DialogModalProps, 'children'>) => {
  const [createTxMethod, setCreateTxMethod] =
    useState<ECreateTransactionMethods>(
      ECreateTransactionMethods.CREATE_AND_SIGN,
    );
  const { assets } = useVaultInfosContext();
  const {
    form,
    nicks,
    accordion,
    transactionsFields,
    transactionRequest,
    resolveTransactionCosts,
    transactionFee,
    isLoadingVault,
    getBalanceAvailable,
    handleClose,
  } = useCreateTransaction({
    assets: assets.assets,
    hasAssetBalance: assets.hasAssetBalance,
    getCoinAmount: assets.getCoinAmount,
    onClose: props.onClose,
    isOpen: props.isOpen,
  });

  const { isOpen, onToggle, onClose } = useDisclosure();
  const { isMobile } = useVerifyBrowserType();

  const currentAmount = form.watch(`transactions.${accordion.index}.amount`);
  const isCurrentAmountZero = Number(currentAmount) === 0;
  const isTransactionFeeLoading =
    isLoadingVault ||
    resolveTransactionCosts.isPending ||
    !transactionFee ||
    Number(transactionFee) === 0;

  const isDisabled =
    !form.formState.isValid || isCurrentAmountZero || isTransactionFeeLoading;

  return (
    <Dialog.Modal
      {...props}
      onClose={handleClose}
      closeOnOverlayClick={false}
      size={{ base: 'full', sm: 'lg' }}
    >
      <Dialog.Header
        onClose={handleClose}
        position={{ base: 'static', sm: 'relative' }}
        mb={0}
        maxH={40}
        maxW={480}
        title="Create Transaction"
        description={`Send single or batch payments with multi assets. \n You can send multiple types of assets to different addresses.`}
      />

      <Dialog.Body maxW={500} maxH={'full'} mt={{ sm: 4 }}>
        <CreateTransactionForm
          form={form}
          nicks={nicks}
          assets={assets}
          accordion={accordion}
          transactionsFields={transactionsFields}
          isFeeCalcLoading={isTransactionFeeLoading}
          getBalanceAvailable={getBalanceAvailable}
        />
      </Dialog.Body>

      <Flex
        wrap="wrap"
        justifyContent="space-between"
        w="full"
        maxW={480}
        my={{ base: 3, sm: 6 }}
      >
        <Divider mb={2} w="full" />
        <Text
          visibility={!transactionFee ? 'hidden' : 'visible'}
          variant="description"
        >
          Max fee:{' '}
          {isMobile ? (
            <Popover placement="top-start" isOpen={isOpen} onClose={onClose}>
              <PopoverTrigger>
                <Icon
                  color="grey.200"
                  boxSize="14px"
                  as={TooltipIcon}
                  onClick={onToggle}
                />
              </PopoverTrigger>
              <PopoverContent
                bg="grey.825"
                p={2}
                borderColor="dark.100"
                maxW={270}
                display={!isOpen ? 'none' : 'block'}
                _focus={{ ring: 'none' }}
              >
                <PopoverCloseButton />
                <PopoverBody color="white">
                  {`Max Fee is the most that you might pay for the transaction. Only the actual fee will be deducted from your wallet. 100% of this fee goes to the network.`}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ) : (
            <Tooltip
              label="Max Fee is the most that you might pay for the transaction. Only the actual fee will be deducted from your wallet. 100% of this fee goes to the network."
              fontSize="xs"
              bg="grey.825"
              rounded={8}
              maxW={270}
              overflow="hidden"
              placement="top-start"
              padding={4}
              closeOnScroll
            >
              <Icon color="grey.200" boxSize="14px" as={TooltipIcon} />
            </Tooltip>
          )}
        </Text>
        <Text variant="description">
          {transactionFee} {transactionFee && 'ETH'}
        </Text>
      </Flex>

      <Dialog.Actions maxW={480} hideDivider mt="auto">
        <Dialog.SecondaryAction onClick={handleClose}>
          Cancel
        </Dialog.SecondaryAction>

        <Menu>
          <Dialog.PrimaryAction
            // leftIcon={<SquarePlusIcon />}
            isDisabled={isDisabled}
            isLoading={transactionRequest.isPending}
            onClick={form.handleCreateTransaction}
            _hover={{
              opacity: !isDisabled && 0.8,
            }}
          >
            {createTxMethod}
          </Dialog.PrimaryAction>
          <MenuList>
            <MenuItem
              display="flex"
              flexDir="column"
              alignItems="center"
              gap={2}
            >
              <Heading
                fontSize="sm"
                color={
                  createTxMethod === ECreateTransactionMethods.CREATE_AND_SIGN
                    ? 'warning.500'
                    : 'white'
                }
                fontWeight={400}
                lineHeight="14.52px"
              >
                {ECreateTransactionMethods.CREATE_AND_SIGN}
              </Heading>
              <Text
                variant="description"
                color={'grey.425'}
                fontSize="xs"
                lineHeight="12.1px"
              >
                Create and sign the transaction
              </Text>
            </MenuItem>
            <MenuItem
              display="flex"
              flexDir="column"
              alignItems="center"
              gap={2}
            >
              <Heading
                fontSize="sm"
                color={
                  createTxMethod === ECreateTransactionMethods.CREATE
                    ? 'warning.500'
                    : 'white'
                }
                fontWeight={400}
                lineHeight="14.52px"
              >
                {ECreateTransactionMethods.CREATE}
              </Heading>
              <Text
                variant="description"
                color={'grey.425'}
                fontSize="xs"
                lineHeight="12.1px"
              >
                Just create the transaction
              </Text>
            </MenuItem>
          </MenuList>

          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} />
        </Menu>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateTransactionDialog };
