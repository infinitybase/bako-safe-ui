import {
  Center,
  Flex,
  HStack,
  Icon,
  StackProps,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaPlay } from 'react-icons/fa';

import { Address, Handle } from '@/components';
import { AssetModel } from '@/modules/core';
import { useAddressNicknameResolver } from '@/modules/core/hooks/useAddressNicknameResolver';
import { TransactionWithVault } from '@/modules/transactions/services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { AddressActions } from '../address-actions';

interface ContractAddressesProps extends StackProps {
  asset?: AssetModel;
  transaction: TransactionWithVault;
  hasToken?: boolean;
}

const ContractAddresses = ({
  transaction,
  ...props
}: ContractAddressesProps) => {
  const {
    screenSizes: { isExtraSmall, isLitteSmall, isMobile },
  } = useWorkspaceContext();
  const { resolveAddressContactHandle } = useAddressNicknameResolver();

  const mainOperation = transaction.summary?.operations[0];

  if (!mainOperation) {
    return null;
  }

  const { from, to } = mainOperation;

  const _from = from?.address
    ? resolveAddressContactHandle(from.address)
    : undefined;
  const _to = to?.address ? resolveAddressContactHandle(to.address) : undefined;

  return (
    <HStack
      py={2}
      spacing={{ base: 1, xs: 10 }}
      w="full"
      justifyContent="space-between"
      borderTopWidth={1}
      {...props}
    >
      {from?.address && (
        <HStack
          justifyContent="flex-start"
          spacing={{ base: 1, xs: 2 }}
          flex={1}
        >
          <VStack alignItems="start" spacing={2}>
            {_from?.contact && (
              <Text
                isTruncated
                textOverflow="ellipsis"
                maxW={{
                  base: isExtraSmall ? '80px' : isLitteSmall ? '90px' : '125px',
                  xs: '180px',
                  sm: isMobile ? '180px' : '135px',
                }}
                fontSize={isExtraSmall ? 'xs' : 'sm'}
                textAlign="start"
                textColor="grey.75"
              >
                {_from.contact}
              </Text>
            )}

            {!_from?.contact && !_from?.handle && (
              <Address
                value={from.address}
                justifyContent="start"
                textAlign="start"
                color={_from?.contact ? 'grey.500' : 'grey.75'}
              />
            )}

            {_from?.handle && (
              <Handle
                value={_from.handle}
                isTruncated
                textOverflow="ellipsis"
                maxW={{
                  base: isExtraSmall ? '55px' : '65px',
                  xs: '155px',
                  sm: isMobile ? '155px' : '110px',
                }}
              />
            )}
          </VStack>

          <AddressActions address={from?.address} handle={_from?.handle} />
        </HStack>
      )}

      <Flex alignItems="center" justifyContent="center">
        <Center
          borderRadius={5}
          bgColor="grey.825"
          borderWidth={1}
          borderColor="grey.925"
          boxSize="30px"
        >
          <Icon color="grey.250" fontSize="12px" as={FaPlay} />
        </Center>
      </Flex>

      {to?.address && (
        <HStack justifyContent="flex-end" spacing={{ base: 1, xs: 2 }} flex={1}>
          <VStack alignItems="end" spacing={2}>
            {_to?.contact && (
              <Text
                isTruncated
                textOverflow="ellipsis"
                maxW={{
                  base: isExtraSmall ? '80px' : isLitteSmall ? '90px' : '125px',
                  xs: '180px',
                  sm: isMobile ? '180px' : '135px',
                }}
                fontSize={isExtraSmall ? 'xs' : 'sm'}
                textAlign="end"
                textColor="grey.75"
              >
                {_to.contact}
              </Text>
            )}

            {!_to?.contact && !_to?.handle && (
              <Address
                value={to.address}
                justifyContent="end"
                textAlign="end"
                color={_to?.contact ? 'grey.500' : 'grey.75'}
              />
            )}

            {_to?.handle && (
              <Handle
                value={_to.handle}
                isTruncated
                textOverflow="ellipsis"
                maxW={{
                  base: isExtraSmall ? '55px' : '65px',
                  xs: '155px',
                  sm: isMobile ? '155px' : '110px',
                }}
              />
            )}
          </VStack>

          <AddressActions address={to?.address} handle={_to?.handle} />
        </HStack>
      )}
    </HStack>
  );
};

export { ContractAddresses };
