import {
  Avatar,
  Button,
  Card,
  Clipboard,
  Flex,
  Icon,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from 'bako-ui';
import { Provider } from 'fuels';
import { memo, useMemo } from 'react';
import { RiFileCopyFill } from 'react-icons/ri';

import { UsersIcon } from '@/components';
import { CopyTopMenuIcon } from '@/components/icons/copy-top-menu';
import { AddressUtils, getChainId } from '@/modules/core';
import {
  useBakoIdAvatar,
  useResolverNameQuery,
} from '@/modules/core/hooks/bako-id';

interface MyAccountSignerCardProps {
  address: string;
  providerInstance: Promise<Provider>;
}

export const MyAccountSignerCard = memo(
  ({ address, providerInstance }: MyAccountSignerCardProps) => {
    const { avatar, isLoading: isLoadingAvatar } = useBakoIdAvatar(
      address,
      getChainId(),
    );
    const { name, isLoading: isLoadingName } = useResolverNameQuery({
      address,
      providerInstance,
    });

    const isLoading = useMemo(
      () => isLoadingAvatar || isLoadingName,
      [isLoadingAvatar, isLoadingName],
    );

    return (
      <Card.Root bg="bg.muted" rounded="lg" w="full" variant="subtle">
        <Card.Body p={4} flexDirection="row" gap={3} alignItems="center">
          {isLoading && (
            <>
              <Skeleton boxSize="36px" />
              <Stack gap={2} flex="1">
                <Skeleton h="12px" w="80px" />
                <Skeleton h="10px" w="120px" />
              </Stack>
            </>
          )}
          {!isLoading && (
            <>
              <Avatar
                src={avatar || undefined}
                fallback={<UsersIcon />}
                shape="rounded"
                boxSize="36px"
              />
              <Stack gap={2}>
                {name && (
                  <Text
                    color="textPrimary"
                    fontSize="xs"
                    lineHeight="shorter"
                    fontWeight="medium"
                  >
                    {name}
                  </Text>
                )}
                <Flex alignItems="center" gap={2}>
                  <Tooltip positioning={{ placement: 'top' }} content={address}>
                    <Text color="gray.400" fontSize="xs" lineHeight="shorter">
                      {AddressUtils.format(address, 6)}
                    </Text>
                  </Tooltip>

                  <Clipboard.Root value={address}>
                    <Clipboard.Trigger asChild>
                      <Button
                        variant="ghost"
                        size="xs"
                        color="gray.400"
                        p={0}
                        w={3}
                        h="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        minW={0}
                      >
                        <Clipboard.Indicator
                          copied={<Icon as={RiFileCopyFill} boxSize={3} />}
                        >
                          <CopyTopMenuIcon boxSize={3} />
                        </Clipboard.Indicator>
                      </Button>
                    </Clipboard.Trigger>
                  </Clipboard.Root>
                </Flex>
              </Stack>
            </>
          )}
        </Card.Body>
      </Card.Root>
    );
  },
);

MyAccountSignerCard.displayName = 'MyAccountSignerCard';
