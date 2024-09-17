import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import React from 'react';

import { Dialog } from '@/components';

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
  //   const [createTxMethod, setCreateTxMethod] =
  //     useState<ECreateTransactionMethods>(
  //       ECreateTransactionMethods.CREATE_AND_SIGN,
  //     );
  return (
    <Menu>
      <Dialog.PrimaryAction
        isDisabled={isDisabled}
        isLoading={isLoading}
        // onClick={handleCreateTransaction}
        onClick={handleCreateAndSignTransaction}
        _hover={{
          opacity: !isDisabled && 0.8,
        }}
      >
        {createTxMethod}
      </Dialog.PrimaryAction>
      <MenuList
        p={0}
        sx={{
          bg: 'red',
        }}
      >
        <MenuItem
          display="flex"
          flexDir="column"
          alignItems="center"
          gap={2}
          onClick={() =>
            setCreateTxMethod(ECreateTransactionMethods.CREATE_AND_SIGN)
          }
          _hover={{ background: 'dark.150' }}
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
          onClick={() => setCreateTxMethod(ECreateTransactionMethods.CREATE)}
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
  );
};

export default CreateTxMenuButton;
