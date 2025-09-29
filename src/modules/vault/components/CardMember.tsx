import { WarningTwoIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Badge,
  chakra,
  Flex,
  HStack,
  Icon,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';

import { AddAddressBook, AddressWithCopyBtn, Handle } from '@/components';
import { Card } from '@/components/card';
import { TypeUser } from '@/modules/auth';
import { AddressUtils } from '@/modules/core';
import { useScreenSize } from '@/modules/core/hooks';
import { useBakoIdAvatar } from '@/modules/core/hooks/bako-id';
import { useNetworks } from '@/modules/network/hooks';
import { useNotification } from '@/modules/notification';
import { HandleUtils } from '@/utils/handle';

const { VITE_BAKO_ID_URL } = import.meta.env;

interface CardMemberProps {
  member: {
    nickname?: string;
    handle?: string;
    avatar: string;
    address: string;
    type?: TypeUser;
  };
  isOwner: boolean;
  isGrid?: boolean;
  hasAdd?: boolean;
}

const SignerCard = chakra(Card, {
  baseStyle: {
    w: 'full',
    p: 3,
    bg: 'dark.600',
    flex: 1,
  },
});

const CardMemberBagde = () => {
  return (
    <Badge py={0} variant="success" alignSelf="flex-start" fontSize="2xs">
      Owner
    </Badge>
  );
};

const CardMember = ({
  member,
  isOwner,
  isGrid = true,
  hasAdd = true,
}: CardMemberProps) => {
  const { isLitteSmall, isLargerThan680, isLargerThan1700, isExtraLarge } =
    useScreenSize();
  const toast = useNotification();
  const { currentNetwork } = useNetworks();

  // the avatar request is enabled only when have handle
  const { avatar, isLoading: isLoadingAvatar } = useBakoIdAvatar(
    member?.handle || member.address,
    currentNetwork.chainId,
  );

  const hasNickname = member?.nickname;
  const address =
    member?.type === TypeUser.WEB_AUTHN
      ? AddressUtils.toBech32(member.address)
      : member.address;

  return (
    <SignerCard
      w="full"
      minW={{ base: 'unset', xs: 320 }}
      bg="gradients.transaction-card"
      borderColor="gradients.transaction-border"
      backdropFilter="blur(6px)"
      alignItems="center"
      display="flex"
      boxShadow="lg"
    >
      <Flex flexDir="row" gap={2} w="full" alignItems="center">
        <Skeleton
          isLoaded={!isLoadingAvatar}
          boxSize={{ base: '32px', xs: '40px' }}
        >
          <Avatar
            borderRadius={8}
            src={avatar || member?.avatar}
            boxSize="full"
            border={avatar ? 'none' : '1px solid'}
            borderColor="grey.75"
          />
        </Skeleton>

        <HStack
          w="full"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          flex={1}
        >
          <VStack
            align="flex-start"
            spacing={0}
            justifyContent="center"
            flex={1}
          >
            <HStack w="full" justifyContent="space-between" spacing={2}>
              {hasNickname ? (
                <Text
                  fontSize="xs"
                  color="grey.200"
                  fontWeight="medium"
                  maxW={isOwner ? 180 : 180}
                  isTruncated
                >
                  {member?.nickname}
                </Text>
              ) : (
                <AddAddressBook address={member.address} hasAdd={hasAdd} />
              )}

              {isOwner && <CardMemberBagde />}
            </HStack>

            <HStack w="full" justifyContent="flex-start" spacing={2}>
              {member.handle && (
                <Handle
                  value={member.handle}
                  fontSize="xs"
                  isTruncated
                  textOverflow="ellipsis"
                  maxW={
                    isGrid
                      ? {
                          base: isLitteSmall ? '70px' : '140px',
                          xs: isLargerThan680 ? '85px' : '140px',
                          md: isExtraLarge ? '85px' : '140px',
                          '2xl': isLargerThan1700 ? '90px' : '140px',
                        }
                      : '95px'
                  }
                  onClick={() => {
                    const handle = HandleUtils.fromHandle(member.handle ?? '');
                    window.open(
                      `${VITE_BAKO_ID_URL}/profile/${handle}`,
                      '_BLANK',
                    );
                  }}
                />
              )}
              <AddressWithCopyBtn
                value={address}
                isSidebarAddress
                flexDir="row-reverse"
                gap={0.5}
                textProps={{
                  fontSize: 'xs',
                  color: 'grey.250',
                }}
                onClick={() => {
                  if (member?.type === TypeUser.EVM) {
                    toast({
                      position: 'top-right',
                      duration: 3000,
                      isClosable: false,
                      title: 'Copied!',
                      status: 'warning',
                      description:
                        'This is your login account, DO NOT send assets to this address.',
                      icon: (
                        <Icon
                          fontSize="2xl"
                          color="brand.500"
                          as={WarningTwoIcon}
                        />
                      ),
                    });
                  }
                }}
                copyBtnProps={{
                  iconProps: {
                    'aria-label': 'Copy',
                    fontSize: 'xs',
                  },
                }}
              />
            </HStack>
          </VStack>
        </HStack>
      </Flex>
    </SignerCard>
  );
};

export { CardMember };
