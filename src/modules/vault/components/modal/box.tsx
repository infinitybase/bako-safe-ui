import {
  Avatar,
  Badge,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
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

const VaultItemBox = (props: VaultDrawerBoxProps) => {
  const { isActive, name, address, members, root, ...rest } = props;
  const isPending = useTransactionsSignaturePending([props.id!]);
  const showPending = isPending.data?.transactionsBlocked;
  const needSignature = isPending.data?.pendingSignature;

  const userIcon = members === 1 ? LuUser2 : LuUsers2;

  const renderStatusBadge = () => {
    if (showPending) {
      if (needSignature) {
        return (
          <WaitingSignatureBadge
            isLoading={isPending.isLoading}
            quantity={isPending.data?.ofUser ?? 0}
            label="Pending Signature"
          />
        );
      } else {
        return (
          <WaitingSignatureBadge
            isLoading={isPending.isLoading}
            quantity={isPending.data?.ofUser ?? 0}
            label="Pending Transaction"
          />
        );
      }
    }
    return null;
  };

  return (
    <Card
      {...rest}
      w="100%"
      cursor="pointer"
      borderColor={isActive ? 'brand.500' : 'dark.100'}
      borderWidth="1px"
      h="76px"
      p={3}
      display="flex"
      alignItems="center"
    >
      <Flex w="100%" align="center" justify="space-between">
        <HStack spacing={4} align="center">
          <Avatar
            variant="roundedSquare"
            color="grey.250"
            bgColor="grey.950"
            name={name}
            size="sm"
          />
          <VStack spacing={2} align="flex-start">
            <Text
              variant="subtitle"
              isTruncated
              maxW={{ base: 120, xs: 250 }}
              color="grey.75"
              fontSize="xs"
              lineHeight="14px"
            >
              {name}
            </Text>
            <Text
              fontSize="xs"
              color="grey.500"
              lineHeight="14px"
              isTruncated
              maxW={{ base: 120, xs: 250 }}
            >
              {AddressUtils.format(address ?? '', 4)}
            </Text>
          </VStack>
        </HStack>

        <VStack spacing={2} align="flex-end">
          {members !== undefined && (
            <HStack spacing={1} align="center">
              <Text fontSize="sm" color="grey.75" lineHeight="20px">
                {members}
              </Text>
              <Icon as={userIcon} boxSize={5} color="grey.75" />
            </HStack>
          )}

          {(showPending || root) && (
            <HStack spacing={2}>
              {renderStatusBadge()}
              {root && !showPending && (
                <Badge
                  variant="gray"
                  fontSize="2xs"
                  color="grey.75"
                  h="20px"
                  px={3}
                  borderRadius="full"
                >
                  Personal
                </Badge>
              )}
              {root && showPending && (
                <Badge
                  variant="gray"
                  fontSize="2xs"
                  color="grey.75"
                  h="20px"
                  px={3}
                  borderRadius="full"
                >
                  Personal
                </Badge>
              )}
            </HStack>
          )}
        </VStack>
      </Flex>
    </Card>
  );
};

export { VaultItemBox };
