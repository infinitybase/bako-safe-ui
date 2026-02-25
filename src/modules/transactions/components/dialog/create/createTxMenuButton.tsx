import { Button, Heading, HStack, Menu, Text } from 'bako-ui';
import { useCallback } from 'react';

import { Dialog } from '@/components';
import { ChevronDownIcon } from '@/components/icons/chevron-down';

export enum ECreateTransactionMethods {
  CREATE = 'Create',
  CREATE_AND_SIGN = 'Create and sign',
  PENDING_TRANSACTION = 'Pending Transaction',
}

export interface CreateTxMenuButtonProps {
  isLoading: boolean;
  isDisabled: boolean;
  handleCreateTransaction?: () => void;
  handleCreateAndSignTransaction?: () => void;
  createTxMethod: ECreateTransactionMethods;
  setCreateTxMethod: (method: ECreateTransactionMethods) => void;
}

const CreateTxMenuButton = ({
  handleCreateTransaction,
  handleCreateAndSignTransaction,
  isDisabled,
  isLoading,
  createTxMethod,
  setCreateTxMethod,
}: CreateTxMenuButtonProps) => {
  const handleCreateTransactionByMethod = useCallback(() => {
    return createTxMethod === ECreateTransactionMethods.CREATE
      ? handleCreateTransaction?.()
      : handleCreateAndSignTransaction?.();
  }, [createTxMethod, handleCreateTransaction, handleCreateAndSignTransaction]);

  return (
    <Menu.Root positioning={{ placement: 'top-end' }}>
      <HStack w="full">
        <HStack w="full" gap={0.5}>
          <Dialog.PrimaryAction
            w="auto"
            flex={1}
            aria-label="Create Transaction Primary Action"
            disabled={isDisabled}
            loading={isLoading}
            onClick={() => handleCreateTransactionByMethod()}
            _hover={{
              opacity: !isDisabled ? 0.8 : 1,
            }}
            _disabled={{
              backgroundColor: 'colorPalette.solid/24',
            }}
            borderRadius="8px 0px 0px 8px"
          >
            {createTxMethod}
          </Dialog.PrimaryAction>
          <Menu.Trigger
            aria-label={'Menu select mode create tx'}
            asChild
            w="20px"
            borderRadius="0px 8px 8px 0px"
            disabled={isDisabled || isLoading}
          >
            <Button
              _disabled={{
                backgroundColor: 'colorPalette.solid/24',
              }}
              disabled={isDisabled || isLoading}
            >
              <ChevronDownIcon
                transform="rotate(180deg)"
                fontSize="24px"
                color="gray.700"
              />
            </Button>
          </Menu.Trigger>
        </HStack>
        <Menu.Portal>
          <Menu.Positioner zIndex="2000 !important">
            <Menu.Content overflow="hidden">
              <Menu.Item
                value="create-and-sing"
                display="flex"
                flexDir="column"
                alignItems="start"
                gap={2}
                onClick={() =>
                  setCreateTxMethod(ECreateTransactionMethods.CREATE_AND_SIGN)
                }
                _hover={{ bg: 'gray.500' }}
                borderRadius="12px"
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
                  // variant="description"
                  color={'grey.425'}
                  fontSize="xs"
                  lineHeight="12.1px"
                >
                  Create and sign the transaction
                </Text>
              </Menu.Item>
              <Menu.Item
                display="flex"
                flexDir="column"
                aria-label="Menu item create tx"
                alignItems="start"
                gap={2}
                onClick={() =>
                  setCreateTxMethod(ECreateTransactionMethods.CREATE)
                }
                _hover={{ bg: 'gray.500' }}
                borderRadius="12px"
                value="create"
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
                  // variant="description"
                  color={'grey.425'}
                  fontSize="xs"
                  lineHeight="12.1px"
                >
                  Just create the transaction
                </Text>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Portal>
      </HStack>
    </Menu.Root>
  );
};

export default CreateTxMenuButton;
