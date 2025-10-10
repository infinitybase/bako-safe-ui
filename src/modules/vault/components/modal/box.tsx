import {
  Avatar,
  Badge,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { memo, useMemo } from 'react';
import { LuUser2, LuUsers2 } from 'react-icons/lu';

import { Card, CardProps } from '@/components';
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

  const userIcon = useMemo(
    () => (members === 1 ? LuUser2 : LuUsers2),
    [members],
  );

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
        <HStack gap={1} align="center">
          <Text fontSize="sm" color="grey.75" lineHeight="20px">
            {members}
          </Text>
          <Icon as={userIcon} boxSize={5} color="grey.75" />
        </HStack>
      ) : null,
    [members, userIcon],
  );

  return (
    <Card
      {...rest}
      w="100%"
      cursor="pointer"
      borderColor={isActive ? 'brand.500' : 'dark.100'}
      borderWidth="1px"
      h={76}
      p={3}
      display="flex"
      alignItems="center"
    >
      <Flex w="100%" align="center" justify="space-between">
        <HStack gap={4} align="center">
          <Avatar.Root
            shape="rounded"
            color="grey.250"
            bgColor="grey.950"
            size={'md'}
            css={{
              '> div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 'normal',
              },
            }}
          >
            <Avatar.Fallback name={name} />
          </Avatar.Root>
          <VStack gap={2} align="flex-start">
            <Text
              // variant="subtitle"
              truncate
              maxW={{ base: 120, sm: 250 }}
              color="grey.75"
              fontSize="xs"
              lineHeight="16px"
            >
              {name}
            </Text>
            <Text
              fontSize="xs"
              color="grey.500"
              lineHeight="16px"
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
              <HStack gap={2}>
                {root && RootBadge}
                {StatusBadge}
              </HStack>
            </>
          )}
        </VStack>
      </Flex>
    </Card>
  );
};

export const VaultItemBox = memo(VaultItemBoxComponent);
