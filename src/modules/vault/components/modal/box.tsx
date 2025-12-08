import { Avatar, Badge, HStack, Skeleton, Text, VStack } from 'bako-ui';
import { memo, useMemo } from 'react';

import { Card, CardProps } from '@/components';
import { AddressUtils } from '@/modules/core';
import {
  useTransactionsSignaturePending,
  WaitingSignatureBadge,
} from '@/modules/transactions';
import { moneyFormat } from '@/utils';

import { useHasReservedCoins } from '../../hooks';
import { PredicateWorkspace } from '../../services';

interface VaultItemBoxText {
  type: 'primary' | 'secondary';
  children?: React.ReactNode;
  isActive?: boolean;
  isLoading?: boolean;
}

const VaultItemBoxText = (props: VaultItemBoxText) => {
  const { type, isActive, children, isLoading } = props;

  if (isLoading) return <Skeleton height="12px" width="40px" />;
  if (!children) return;

  const isPrimary = type === 'primary';
  const color = isPrimary ? (isActive ? 'gray.50' : 'gray.200') : 'gray.300';
  const fontWeight = isPrimary ? 500 : 400;

  return (
    <Text color={color} fontWeight={fontWeight} fontSize="xs" lineHeight="12px">
      {children}
    </Text>
  );
};

interface VaultItemBoxComponentProps extends CardProps {
  id: string;
  name: string;
  address: string;
  workspace: PredicateWorkspace;
  isActive?: boolean;
  isSingleWorkspace?: boolean;
  members?: number;
  requiredSigners?: number;
  root?: boolean;
}

const VaultItemBoxComponent = ({
  isActive,
  name,
  address,
  members,
  requiredSigners,
  root,
  id,
  workspace,
  ...rest
}: VaultItemBoxComponentProps) => {
  const { data, isLoading: isLoadingBalance } = useHasReservedCoins(
    id,
    workspace.id,
  );
  const isPending = useTransactionsSignaturePending([id!]);
  const showPending = isPending.data?.transactionsBlocked;
  const needSignature = isPending.data?.pendingSignature;

  const StatusBadge = useMemo(() => {
    if (!showPending && !needSignature) return;

    return (
      <WaitingSignatureBadge
        isLoading={isPending.isLoading}
        quantity={isPending.data?.ofUser ?? 0}
        label={needSignature ? 'Pending Signature' : 'Pending Transaction'}
      />
    );
  }, [isPending.data?.ofUser, isPending.isLoading, needSignature, showPending]);

  const RootBadge = useMemo(() => {
    if (!root) return;

    return (
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
    );
  }, [root]);

  const SignersCount = useMemo(() => {
    if (!requiredSigners || !members) return;

    return (
      <VaultItemBoxText type="secondary" isActive={isActive}>
        {requiredSigners}/{members} signers
      </VaultItemBoxText>
    );
  }, [requiredSigners, members, isActive]);

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
          <VaultItemBoxText type="primary" isActive={isActive}>
            {name}
          </VaultItemBoxText>

          <VaultItemBoxText type="secondary" isActive={isActive}>
            {AddressUtils.format(address ?? '', 4)}
          </VaultItemBoxText>
        </VStack>
      </HStack>

      <VStack gap={2} align="flex-end">
        <VaultItemBoxText
          type="primary"
          isActive={isActive}
          isLoading={isLoadingBalance}
        >
          {data && moneyFormat(data.currentBalanceUSD)}
        </VaultItemBoxText>

        <HStack gap={3}>
          {StatusBadge}
          {RootBadge}
          {SignersCount}
        </HStack>
      </VStack>
    </Card>
  );
};

export const VaultItemBox = memo(VaultItemBoxComponent);
