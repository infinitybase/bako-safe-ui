import {
  Button,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
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
    <Menu
      styleConfig={{
        bgColor: 'transparent',
      }}
      placement="top-end"
    >
      <HStack w="full" ref={actionMenuRef}>
        <HStack w="full" spacing={0.5}>
          <Dialog.PrimaryAction
            aria-label="Create Transaction Primary Action"
            isDisabled={isDisabled}
            isLoading={isLoading}
            onClick={() => handleCreateTransactionByMethod()}
            _hover={{
              opacity: !isDisabled && 0.8,
            }}
            borderRadius="8px 0px 0px 8px"
          >
            {createTxMethod}
          </Dialog.PrimaryAction>
          <MenuButton
            aria-label={'Menu select mode create tx'}
            as={Button}
            rightIcon={<ChevronDownIcon fontSize="24px" color="dark.950" />}
            variant="primary"
            w="20px"
            pl={2}
            borderRadius="0px 8px 8px 0px"
            isDisabled={isDisabled || isLoading}
          />
        </HStack>

        <MenuList
          bg="dark.950"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="0px 4px 40px 0px rgba(0, 0, 0, 0.75);"
          border="1px solid #2B2927"
          width={`${menuWidth}px`}
        >
          <MenuItem
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
            aria-label="Menu item create tx"
            alignItems="start"
            gap={2}
            onClick={() => setCreateTxMethod(ECreateTransactionMethods.CREATE)}
            _hover={{ background: 'dark.150' }}
            padding="12px 4px 12px 16px"
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
      </HStack>
    </Menu>
  );
};

export default CreateTxMenuButton;
