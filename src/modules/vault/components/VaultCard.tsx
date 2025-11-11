import { useMutation } from '@tanstack/react-query';
import {
  Card,
  CardRootProps,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Stack,
  Text,
  useClipboard,
  VStack,
} from 'bako-ui';
import { useEffect, useMemo, useState } from 'react';
import { RiFileCopyFill } from 'react-icons/ri';

import { TeamIcon } from '@/components';
import { CopyTopMenuIcon } from '@/components/icons/copy-top-menu';
import { useHasReservedCoins } from '@/modules';
import { AddressUtils } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { VaultService } from '../services';
import { VaultIconInfo } from './vaultIconInfo';

interface VaultCardProps extends CardRootProps {
  name: string;
  inHome?: boolean;
  isHidden?: boolean;
  address: string;
  signersCount: number;
  requiredSigners: number;
  id: string;
  workspaceId: string;
}
export const VaultCard = ({
  name,
  inHome,
  isHidden,
  address,
  requiredSigners,
  signersCount,
  id,
  workspaceId,
  ...rest
}: VaultCardProps) => {
  const {
    screenSizes: { isExtraSmall },
    userVaults,
    workspaceInfos: {
      requests: { latestPredicates },
    },
  } = useWorkspaceContext();
  const { data, isLoading: isLoadingBalance } = useHasReservedCoins(
    id,
    workspaceId,
  );
  const { copy, copied } = useClipboard({ value: address });

  const { mutate: toogleVisibility, isPending } = useMutation({
    mutationFn: VaultService.toggleVisibility,
    onSuccess: () => {
      userVaults.request.refetch();
      latestPredicates.refetch();
    },
  });
  const [localHidden, setLocalHidden] = useState(isHidden);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalHidden((prev) => !prev);
    toogleVisibility(address);
  };

  useEffect(() => {
    setLocalHidden(isHidden);
  }, [isHidden]);

  const balanceUSD = useMemo(
    () =>
      Intl.NumberFormat('en-US', {
        style: 'decimal',
        currency: 'USD',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(Number(data?.currentBalanceUSD || 0)),
    [data?.currentBalanceUSD],
  );

  if (inHome && isHidden) return null;

  return (
    <Card.Root
      bg="gray.700"
      w="100%"
      variant="subtle"
      maxW={isExtraSmall ? 272 : 'full'}
      cursor="pointer"
      rounded="2xl"
      zIndex={20}
      {...rest}
      position="relative"
      opacity={!localHidden ? 1 : 0.5}
      transition="opacity 0.3s ease-in-out, background 0.3s ease"
    >
      {/* {inHome ?? (
        <Box
          position="absolute"
          top={3}
          right={3}
          cursor={isPending ? 'not-allowed' : 'pointer'}
          zIndex={10}
          bg="#F5F5F50D"
          borderRadius="6px"
          boxSize={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={isPending ? undefined : handleToggle}
        >
          {isPending ? (
            <Loader
              size="xs"
              color="grey.400"
              borderWidth="2px"
              animationDuration="0.5s"
            />
          ) : localHidden ? (
            <FaEyeSlash size={16} color="#fff" />
          ) : (
            <FaEye size={16} color="#fff" />
          )}
        </Box>
      )} */}
      <Card.Header>
        <HStack justifyContent="space-between" alignItems="start">
          <VStack gap={2} alignItems="start">
            <Heading
              truncate
              lineClamp={1}
              fontSize="xs"
              color="textPrimary"
              fontWeight="semibold"
            >
              {name}
            </Heading>

            <Text fontSize="xs" color="gray.400" lineHeight="shorter">
              {AddressUtils.format(address, 5)}
            </Text>
          </VStack>

          <HStack gap={2}>
            <VaultIconInfo
              onClick={copy}
              tooltipContent={copied ? 'Copied' : 'Copy Address'}
              placement="top"
            >
              <Icon
                as={copied ? RiFileCopyFill : CopyTopMenuIcon}
                color="gray.200"
                w="12px"
              />
            </VaultIconInfo>

            <VaultIconInfo
              placement="top"
              tooltipContent={
                <Stack gap={1} alignItems="center">
                  <Text
                    color="textPrimary"
                    fontSize="xs"
                  >{`${signersCount} members`}</Text>
                  <Text
                    color="textPrimary"
                    fontSize="xs"
                  >{`${requiredSigners} required signers`}</Text>
                </Stack>
              }
            >
              <Icon as={TeamIcon} color="gray.200" w="12px" />
            </VaultIconInfo>
          </HStack>
        </HStack>
      </Card.Header>
      <Card.Footer pt={6}>
        {isLoadingBalance && <Skeleton height="24px" width="170px" />}
        {!isLoadingBalance && (
          <Heading
            fontSize="md"
            color="gray.50"
            fontWeight="bold"
            letterSpacing="wider"
          >
            <Text as="span" color="gray.400">
              ${' '}
            </Text>
            {balanceUSD}
          </Heading>
        )}
      </Card.Footer>
    </Card.Root>
  );
};
