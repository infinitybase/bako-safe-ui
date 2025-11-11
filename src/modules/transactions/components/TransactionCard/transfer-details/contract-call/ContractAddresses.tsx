import { Center, Flex, HStack, Icon, StackProps, Text, VStack } from 'bako-ui';
import { memo, useMemo } from 'react';
import { FaPlay } from 'react-icons/fa';

import { Address, Handle } from '@/components';
import { AssetModel } from '@/modules/core';
import { useAddressNicknameResolver } from '@/modules/core/hooks/useAddressNicknameResolver';
import { TransactionWithVault } from '@/modules/transactions/services';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { AddressActions } from '../address-actions';

interface ContractAddressesProps extends StackProps {
  asset?: AssetModel;
  transaction: TransactionWithVault;
  hasToken?: boolean;
}

const ContractAddresses = memo(
  ({ transaction, ...props }: ContractAddressesProps) => {
    const {
      screenSizes: { isExtraSmall, isLitteSmall, isMobile },
    } = useWorkspaceContext();
    const { resolveAddressContactHandle } = useAddressNicknameResolver();

    const mainOperation = useMemo(
      () => transaction.summary?.operations[0],
      [transaction.summary],
    );

    const { from, to } = mainOperation || {};

    const _from = useMemo(
      () =>
        from?.address ? resolveAddressContactHandle(from.address) : undefined,
      [from?.address, resolveAddressContactHandle],
    );
    const _to = useMemo(
      () => (to?.address ? resolveAddressContactHandle(to.address) : undefined),
      [to?.address, resolveAddressContactHandle],
    );

    if (!mainOperation) {
      return null;
    }

    return (
      <HStack
        p={4}
        bg="gray.600"
        rounded="lg"
        gap={{ base: 1, sm: 10 }}
        w="full"
        justifyContent="space-between"
        mb={1}
        _last={{
          mb: 0,
        }}
        {...props}
      >
        {from?.address && (
          <HStack justifyContent="flex-start" gap={{ base: 1, sm: 2 }} flex={1}>
            <VStack alignItems="start" gap={2}>
              {_from?.contact && (
                <Text
                  truncate
                  maxW={{
                    base: isExtraSmall
                      ? '80px'
                      : isLitteSmall
                        ? '90px'
                        : '125px',
                    sm: isMobile ? '180px' : '135px',
                  }}
                  fontSize={isExtraSmall ? 'xs' : 'sm'}
                  textAlign="start"
                  color="textPrimary"
                >
                  {_from.contact}
                </Text>
              )}

              {!_from?.contact && !_from?.handle && (
                <Address
                  value={from.address}
                  justifyContent="start"
                  textAlign="start"
                  color="textPrimary"
                />
              )}

              {_from?.handle && (
                <Handle
                  value={_from.handle}
                  truncate
                  textOverflow="ellipsis"
                  maxW={{
                    base: isExtraSmall ? '55px' : '65px',
                    sm: isMobile ? '155px' : '110px',
                  }}
                />
              )}
            </VStack>

            <AddressActions
              address={from?.address}
              handle={_from?.handle}
              hasContact={!!_from?.contact}
            />
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
          <HStack justifyContent="center" gap={{ base: 1, sm: 2 }} flex={1}>
            <VStack alignItems="center" gap={2} flex={1}>
              {_to?.contact && (
                <Text
                  truncate
                  textOverflow="ellipsis"
                  maxW={{
                    base: isExtraSmall
                      ? '80px'
                      : isLitteSmall
                        ? '90px'
                        : '125px',
                    sm: isMobile ? '180px' : '135px',
                  }}
                  fontSize={isExtraSmall ? 'xs' : 'sm'}
                  textAlign="end"
                  color="grey.75"
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
                  truncate
                  textOverflow="ellipsis"
                  maxW={{
                    base: isExtraSmall ? '55px' : '65px',
                    sm: isMobile ? '155px' : '110px',
                  }}
                />
              )}
            </VStack>

            <AddressActions
              address={to?.address}
              handle={_to?.handle}
              hasContact={!!_to?.contact}
            />
          </HStack>
        )}
      </HStack>
    );
  },
);

ContractAddresses.displayName = 'ContractAddresses';

export { ContractAddresses };
