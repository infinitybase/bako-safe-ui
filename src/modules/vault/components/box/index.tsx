import {
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  useClipboard,
} from 'bako-ui';
import { Address } from 'fuels';
import { useCallback, useMemo } from 'react';
import { RiFileCopyFill } from 'react-icons/ri';

import {
  HomeIcon,
  IconTooltipButton,
  LeftAndRightArrow,
  UpRightArrow,
} from '@/components';
import { CopyTopMenuIcon } from '@/components/icons/copy-top-menu';
import { EyeCloseIcon } from '@/components/icons/eye-close';
import { EyeOpenIcon } from '@/components/icons/eye-open';
import { AddressUtils } from '@/modules/core';
import { NetworkService } from '@/modules/network/services';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { VaultInfoBoxSkeleton } from './vaultInfoBoxSkeleton';

interface VaultBoxPropx {
  name: string;
  address: string;
  onChangeVault: () => void;
}

const VaultBox = (props: VaultBoxPropx) => {
  const { name, address, onChangeVault } = props;
  const addressWithChecksum = address ? new Address(address).toString() : '';
  const { copy, copied } = useClipboard({ value: addressWithChecksum });

  const {
    authDetails: {
      userInfos: { network },
    },
    workspaceInfos: {
      handlers: { goHome },
    },
    vaultDetails: {
      assets: {
        balanceUSD,
        visibleBalance,
        setVisibleBalance,
        isLoading: isLoadingAssets,
      },
      vaultRequest: { isLoading: isLoadingVault },
    },
  } = useWorkspaceContext();

  const handleToggleBalanceVisibility = useCallback(() => {
    setVisibleBalance(!visibleBalance);
  }, [setVisibleBalance, visibleBalance]);

  const balance = useMemo(() => balanceUSD || '0', [balanceUSD]);
  const redirectToNetwork = () =>
    window.open(
      `${NetworkService.getExplorer(network?.url)}/account/${address}/assets`,
      '_BLANK',
    );

  const EyeIcon = visibleBalance ? EyeOpenIcon : EyeCloseIcon;
  const isLoading = useMemo(
    () => isLoadingAssets || isLoadingVault,
    [isLoadingAssets, isLoadingVault],
  );

  return (
    <Stack w="100%" gap={4}>
      {/* Headers BTNS */}
      <HStack>
        <Button
          flex={1}
          variant="subtle"
          onClick={goHome}
          flexDirection="column"
          alignItems="center"
          h="auto"
          p={3}
          bg="bg.muted"
          _hover={{
            bg: 'gray.550',
            '& svg, p': {
              opacity: 1,
            },
          }}
        >
          <Icon
            as={HomeIcon}
            w={{ base: 3, sm: 4 }}
            color="gray.50"
            opacity={0.6}
          />
          <Text
            opacity={0.6}
            textTransform="uppercase"
            fontSize="2xs"
            lineHeight="shorter"
          >
            Home
          </Text>
        </Button>
        <Button
          flex={1}
          variant="subtle"
          onClick={onChangeVault}
          flexDirection="column"
          alignItems="center"
          h="auto"
          bg="bg.muted"
          p={3}
          _hover={{
            bg: 'gray.550',
            '& svg, p': {
              opacity: 1,
            },
          }}
        >
          <Icon
            as={LeftAndRightArrow}
            w={{ base: 3, sm: 4 }}
            color="gray.50"
            opacity={0.6}
          />
          <Text
            opacity={0.6}
            textTransform="uppercase"
            fontSize="2xs"
            lineHeight="shorter"
          >
            Account
          </Text>
        </Button>
      </HStack>

      {/* Vault Info Box */}
      {isLoading && <VaultInfoBoxSkeleton />}
      {!isLoading && (
        <Card.Root
          variant="subtle"
          rounded="lg"
          border="1px solid"
          borderColor="bg.muted"
        >
          <Card.Body
            display="flex"
            flexDirection="column"
            gap={1}
            w="full"
            p={3}
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Heading
                size="xs"
                truncate
                textOverflow="ellipsis"
                w="full"
                color="textPrimary"
              >
                {name}
              </Heading>
              <IconTooltipButton
                onClick={redirectToNetwork}
                tooltipContent="View on Explorer"
              >
                <Icon as={UpRightArrow} color="gray.200" w="12px" />
              </IconTooltipButton>
            </Flex>

            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="xs" color="textSecondary">
                {AddressUtils.format(addressWithChecksum, 6)}
              </Text>
              <IconTooltipButton
                onClick={copy}
                tooltipContent={copied ? 'Copied' : 'Copy Address'}
              >
                <Icon
                  as={copied ? RiFileCopyFill : CopyTopMenuIcon}
                  color="gray.200"
                  w="12px"
                />
              </IconTooltipButton>
            </Flex>

            <Flex justifyContent="space-between" alignItems="center">
              {visibleBalance && (
                <Text color="gray.50" fontSize="sm">
                  <Text as="span" color="textSecondary">
                    $
                  </Text>{' '}
                  {balance}
                </Text>
              )}
              {!visibleBalance && <Text color="gray.50">-----</Text>}
              <IconTooltipButton
                tooltipContent={
                  visibleBalance ? 'Hide Balance' : 'Show Balance'
                }
                onClick={handleToggleBalanceVisibility}
              >
                <Icon as={EyeIcon} color="gray.200" w="16px" />
              </IconTooltipButton>
            </Flex>
          </Card.Body>
        </Card.Root>
      )}
    </Stack>
  );
};

export { VaultBox };
