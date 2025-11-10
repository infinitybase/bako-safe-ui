import { Button, Heading, HStack, Menu, Text } from 'bako-ui';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Dialog } from '@/components';
import { ChevronDownIcon } from '@/components/icons/chevron-down';

export enum ECreateTransactionMethods {
  CREATE = 'Create',
  CREATE_AND_SIGN = 'Create and sign',
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
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const [menuWidth, setMenuWidth] = useState(0);

  const updateMenuWidth = useCallback(() => {
    if (actionMenuRef.current) {
      setMenuWidth(actionMenuRef.current.offsetWidth);
    }
  }, []);

  const handleCreateTransactionByMethod = useCallback(() => {
    return createTxMethod === ECreateTransactionMethods.CREATE
      ? handleCreateTransaction?.()
      : handleCreateAndSignTransaction?.();
  }, [createTxMethod, handleCreateTransaction, handleCreateAndSignTransaction]);

  useEffect(() => {
    updateMenuWidth();

    window.addEventListener('resize', updateMenuWidth);

    return () => {
      window.removeEventListener('resize', updateMenuWidth);
    };
  }, [updateMenuWidth]);

  return (
    <Menu.Root positioning={{ placement: 'top-end' }}>
      <HStack w="full" ref={actionMenuRef}>
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
            <Button>
              <ChevronDownIcon fontSize="24px" color="gray.700" />
            </Button>
          </Menu.Trigger>
        </HStack>
        <Menu.Portal>
          <Menu.Positioner zIndex="2000 !important">
            <Menu.Content
              bg="bg.panel"
              borderRadius="xl"
              overflow="hidden"
              borderColor="bg.muted"
              border="1px solid"
              width={`${menuWidth}px`}
            >
              <Menu.Item
                value="create-and-sing"
                display="flex"
                flexDir="column"
                alignItems="start"
                gap={2}
                onClick={() =>
                  setCreateTxMethod(ECreateTransactionMethods.CREATE_AND_SIGN)
                }
                _hover={{ background: 'dark.150' }}
                padding="12px 4px 12px 16px"
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
                _hover={{ background: 'dark.150' }}
                padding="12px 4px 12px 16px"
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
