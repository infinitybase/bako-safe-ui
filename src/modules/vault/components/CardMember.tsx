import { Avatar, Flex, HStack, Icon, Skeleton, Stack, Text } from 'bako-ui';
import { TypeUser } from 'bakosafe';
import { useMemo } from 'react';

import { AddAddressBook, IconTooltipButton, UpRightArrow } from '@/components';
import { ListContactsResponse } from '@/modules/addressBook/services';
import { AddressUtils } from '@/modules/core';
import { useBakoIdAvatar } from '@/modules/core/hooks/bako-id';
import { useAddressNicknameResolver } from '@/modules/core/hooks/useAddressNicknameResolver';
import { useNetworks } from '@/modules/network/hooks';
import { NetworkService } from '@/modules/network/services';
import { formatAddressByUserType } from '@/utils';

interface CardMemberProps {
  member: {
    avatar: string;
    address: string;
    type?: TypeUser;
  };
  isOwner: boolean;
  contacts: ListContactsResponse;
}

const CardMember = ({ member, isOwner, contacts }: CardMemberProps) => {
  const { currentNetwork } = useNetworks();
  const { resolveAddressContactHandle } = useAddressNicknameResolver();
  const handleInfo = useMemo(
    () =>
      contacts?.find(
        (contact) => contact.handle_info?.resolver === member.address,
      )?.handle_info,
    [contacts, member.address],
  );

  const { contact, handle } = resolveAddressContactHandle(
    member.address,
    handleInfo?.handle,
    handleInfo?.resolver,
  );

  // the avatar request is enabled only when have handle
  const { avatar, isLoading: isLoadingAvatar } = useBakoIdAvatar(
    handle || member.address,
    currentNetwork.chainId,
  );

  const memberName =
    handle || contact || AddressUtils.format(member.address, 4);
  const address = member?.type
    ? formatAddressByUserType(member.address, member.type)
    : member.address;

  const redirectToNetwork = () =>
    window.open(
      `${NetworkService.getExplorer(currentNetwork.url)}/account/${member.address}/assets`,
      '_BLANK',
    );

  const hasAdd = !contact;

  return (
    <Flex
      py={6}
      gap={3}
      borderTop="1px solid"
      borderBottom="1px solid"
      borderColor="bg.muted"
      alignItems="center"
      w="full"
    >
      <Skeleton
        loading={isLoadingAvatar}
        boxSize={{ base: '32px', sm: '40px' }}
        rounded="md"
      >
        <Avatar
          borderRadius="md"
          boxSize="full"
          shape="rounded"
          src={avatar || member?.avatar}
        />
      </Skeleton>
      <Stack gap={2} flex={1}>
        <Flex justifyContent="space-between">
          <HStack w="full" gap={2} align="center">
            <Text
              as="span"
              fontSize="xs"
              color="textPrimary"
              fontWeight="medium"
            >
              {memberName}
            </Text>

            {isOwner && (
              <Text
                as="span"
                fontSize="xs"
                color="gray.400"
                lineHeight="shorter"
              >
                Owner
              </Text>
            )}
          </HStack>

          <Flex alignItems="center" gap={2}>
            <AddAddressBook address={member.address} hasAdd={hasAdd} />

            <IconTooltipButton
              onClick={redirectToNetwork}
              tooltipContent="View on Explorer"
              placement="top"
            >
              <Icon as={UpRightArrow} color="gray.200" w="12px" />
            </IconTooltipButton>
          </Flex>
        </Flex>

        <Text as="span" fontSize="xs" color="gray.400" wordBreak="break-all">
          {address}
        </Text>
      </Stack>
    </Flex>
  );
};

export { CardMember };
