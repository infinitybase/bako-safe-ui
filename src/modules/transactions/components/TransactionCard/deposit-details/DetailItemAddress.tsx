import { HStack, StackProps, Text, VStack } from 'bako-ui';
import { memo } from 'react';

import { Address, Handle } from '@/components';
import { AddressUtils } from '@/modules/core';

import { AddressActions } from '../transfer-details/address-actions';

interface DetailItemAddressProps extends StackProps {
  contact: string | undefined;
  handle: string | undefined;
  address: string;
}

export const DetailItemAddress = memo(
  ({ contact, handle, address, ...props }: DetailItemAddressProps) => {
    return (
      <HStack
        alignItems="center"
        justifyContent="center"
        gap={{ base: 1, sm: 2 }}
        minW={{ lg: 190 }}
        {...props}
      >
        <VStack alignItems="center" gap={1}>
          {handle && (
            <Handle
              value={handle}
              truncate
              textOverflow="ellipsis"
              maxW="155px"
            />
          )}

          {contact && !handle && (
            <Text
              truncate
              textOverflow="ellipsis"
              maxW="180px"
              fontSize="xs"
              color="textPrimary"
            >
              {contact}
            </Text>
          )}
          <Address
            value={address}
            customValue={AddressUtils.format(address, 5)}
            isDeposit={true}
            color={contact || handle ? 'gray.400' : 'textPrimary'}
          />
        </VStack>

        <AddressActions
          address={address}
          handle={handle}
          hasContact={!!contact}
        />
      </HStack>
    );
  },
);

DetailItemAddress.displayName = 'DetailItemAddress';
