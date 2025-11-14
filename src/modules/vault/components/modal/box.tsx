import { Avatar, Badge, HStack, Icon, Text, VStack } from 'bako-ui';
import { memo, useMemo } from 'react';

import { Card, CardProps, TeamIcon } from '@/components';
import { AddressUtils } from '@/modules/core';
import {
  useTransactionsSignaturePending,
  WaitingSignatureBadge,
} from '@/modules/transactions';

import { PredicateWorkspace } from '../../services';

interface VaultDrawerBoxProps extends CardProps {
  id?: string;
  isActive?: boolean;
  name: string;
  address: string;
  workspace?: PredicateWorkspace;
  isSingleWorkspace?: boolean;
  isInDapp?: boolean;
  members?: number;
  root?: boolean;
}

const VaultItemBoxComponent = ({
  isActive,
  name,
  address,
  members,
  root,
  id,
  ...rest
}: VaultDrawerBoxProps) => {
  const isPending = useTransactionsSignaturePending([id!]);
  const showPending = isPending.data?.transactionsBlocked;
  const needSignature = isPending.data?.pendingSignature;
  const isRootAndPending = showPending && root;

  const StatusBadge = useMemo(() => {
    if (!showPending && !needSignature) return null;

    return (
      <WaitingSignatureBadge
        isLoading={isPending.isLoading}
        quantity={isPending.data?.ofUser ?? 0}
        label={needSignature ? 'Pending Signature' : 'Pending Transaction'}
      />
    );
  }, [isPending.data?.ofUser, isPending.isLoading, needSignature, showPending]);

  const RootBadge = useMemo(
    () => (
      <Badge
        colorPalette="gray"
        fontSize="2xs"
        color="grey.75"
        h="20px"
        px={3}
        borderRadius="full"
      >
        Personal
      </Badge>
    ),
    [],
  );

  const MembersBadge = useMemo(
    () =>
      members !== undefined ? (
        <HStack gap={2} align="center">
          <Text
            fontSize="2xs"
            color={isActive ? 'gray.100' : 'gray.300'}
            lineHeight="12px"
          >
            {members}
          </Text>
          <Icon
            as={TeamIcon}
            color={isActive ? 'gray.100' : 'gray.300'}
            w="12px"
          />
        </HStack>
      ) : null,
    [members, isActive],
  );

  return (
    <Card
      {...rest}
      w="100%"
      cursor="pointer"
      borderColor={'gray.50'}
      bg={isActive ? 'gray.600' : 'gray.700'}
      borderLeft={isActive ? '2px solid' : 'none'}
      borderWidth={0}
      borderRadius={8}
      p={3}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <HStack gap={3} align="center">
        <Avatar
          shape="rounded"
          color="gray.100"
          bgColor="gray.500"
          size={'sm'}
          css={{
            '> div': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 'normal',
            },
          }}
          name={name}
        />
        <VStack gap={2} align="flex-start">
          <Text
            fontWeight={500}
            truncate
            maxW={{ base: 120, sm: 250 }}
            color={isActive ? 'gray.100' : 'gray.200'}
            fontSize="xs"
            lineHeight="12px"
          >
            {name}
          </Text>
          <Text
            fontSize="xs"
            color="gray.300"
            lineHeight="12px"
            truncate
            maxW={{ base: 120, sm: 250 }}
          >
            {AddressUtils.format(address ?? '', 4)}
          </Text>
        </VStack>
      </HStack>

      <VStack gap={2} align="flex-end">
        {isRootAndPending ? (
          <>
            <HStack gap={3}>
              {RootBadge}
              {MembersBadge}
            </HStack>
            {StatusBadge}
          </>
        ) : (
          <>
            {MembersBadge}
            {root && !showPending && !needSignature &&
              <HStack gap={2}>
                {root && RootBadge}
                {StatusBadge}
              </HStack>
            }
          </>
        )}
      </VStack>
    </Card>
  );
};

export const VaultItemBox = memo(VaultItemBoxComponent);
