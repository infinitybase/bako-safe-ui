import {
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  Tooltip,
  useClipboard,
  VStack,
} from 'bako-ui';
import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';
import { HiArrowDownLeft } from 'react-icons/hi2';
import { RiFileCopyFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import {
  ErrorTooltip,
  TeamIcon,
  TooltipNotEnoughBalance,
  UpRightArrow,
} from '@/components';
import { CopyTopMenuIcon } from '@/components/icons/copy-top-menu';
import { EyeCloseIcon } from '@/components/icons/eye-close';
import { EyeOpenIcon } from '@/components/icons/eye-open';
import { RefreshIcon } from '@/components/icons/refresh-icon';
import { AddressUtils, Pages, useScreenSize } from '@/modules/core';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { NetworkService } from '@/modules/network/services';

import { UseVaultDetailsReturn, useVaultInfosContext } from '../../hooks';
import { getSignaturesCount } from '../../utils';
import BalanceHelperDrawer from '../BalanceHelperDrawer';
import BalanceHelperDialog from '../dialog/BalanceHelper';
import { TooltipPendingTx } from '../TooltipPendingTx';
import { VaultIconInfo } from '../vaultIconInfo';
import OverviewSkeleton from './skeleton';

interface AccountOverviewProps {
  vault: UseVaultDetailsReturn['vault'];
  workspaceId: string;
  onAddAssets: () => void;
  isPendingSigner: boolean;
}

const MotionIcon = motion(Icon);

export const AccountOverview = memo(
  ({
    vault,
    workspaceId,
    onAddAssets,
    isPendingSigner,
  }: AccountOverviewProps) => {
    const {
      assets: {
        balanceUSD,
        visibleBalance,
        setVisibleBalance,
        isUpdating,
        handleManualRefetch,
        isLoading: isLoadingAssets,
        isEthBalanceLowerThanReservedAmount,
        hasBalance,
      },
    } = useVaultInfosContext();
    const { isMobile } = useScreenSize();
    const { isOpen, onOpenChange, onOpen } = useDisclosure();
    const navigate = useNavigate();
    const { copy, copied } = useClipboard({
      value: vault?.data.predicateAddress,
    });

    const isLoading = useMemo(
      () => isLoadingAssets || vault.isLoading,
      [isLoadingAssets, vault.isLoading],
    );
    const accountName = vault?.data.name;

    const handleToggleBalanceVisibility = () => {
      setVisibleBalance(!visibleBalance);
    };

    const redirectToNetwork = () =>
      window.open(
        `${NetworkService.getExplorer(vault.data.provider)}/account/${vault?.data.predicateAddress}/assets`,
        '_BLANK',
      );

    const EyeIcon = visibleBalance ? EyeOpenIcon : EyeCloseIcon;

    const signers = vault?.data?.members?.length || 1;
    const requiredSigners = getSignaturesCount(vault?.data);

    const handleNavigateToSendPage = () => {
      navigate(
        Pages.createTransaction({
          vaultId: vault?.data.id || '',
          workspaceId,
        }),
      );
    };

    const ToolTipComponent = useMemo(() => {
      if (isPendingSigner) {
        return <TooltipPendingTx />;
      }
      if (isEthBalanceLowerThanReservedAmount) {
        return <TooltipNotEnoughBalance />;
      }
      return null;
    }, [isPendingSigner, isEthBalanceLowerThanReservedAmount]);

    return (
      <Card.Root variant="subtle" bg="bg.panel" rounded="2xl" flex={1} h="full">
        {/* Overview Skeleton */}
        {isLoading && <OverviewSkeleton />}

        {!isLoading && (
          <>
            {/* Overview Header */}
            <Card.Header>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                w="full"
              >
                <Heading color="textPrimary" fontSize="sm">
                  {accountName}
                </Heading>

                <Flex gap={1} alignItems="center">
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
                        >{`${signers} members`}</Text>
                        <Text
                          color="textPrimary"
                          fontSize="xs"
                        >{`${requiredSigners} required signers`}</Text>
                      </Stack>
                    }
                  >
                    <Icon as={TeamIcon} color="gray.200" w="12px" />
                  </VaultIconInfo>

                  <VaultIconInfo
                    onClick={redirectToNetwork}
                    tooltipContent="View on Explorer"
                    placement="top"
                  >
                    <Icon as={UpRightArrow} color="gray.200" w="12px" />
                  </VaultIconInfo>
                  <VaultIconInfo
                    tooltipContent={
                      visibleBalance ? 'Hide Balance' : 'Show Balance'
                    }
                    onClick={handleToggleBalanceVisibility}
                    placement="top"
                  >
                    <Icon as={EyeIcon} color="gray.200" w="16px" />
                  </VaultIconInfo>
                  <VaultIconInfo
                    tooltipContent={isUpdating ? 'Updating...' : 'Update'}
                    onClick={handleManualRefetch}
                    placement="top"
                  >
                    <MotionIcon
                      as={RefreshIcon}
                      color="gray.200"
                      w="12px"
                      animate={isUpdating ? { rotate: 360 } : { rotate: 0 }}
                      transition={
                        isUpdating
                          ? { repeat: Infinity, duration: 1, ease: 'linear' }
                          : { duration: 0 }
                      }
                    />
                  </VaultIconInfo>
                </Flex>
              </HStack>
              <Text fontSize="xs" color="gray.400">
                {AddressUtils.format(vault?.data.predicateAddress || '', 6)}
              </Text>
            </Card.Header>

            {/* Overview Body */}
            <Card.Body justifyContent="center">
              {visibleBalance && (
                <Heading color="gray.50" fontSize="3xl">
                  <Text as="span" color="textSecondary">
                    $
                  </Text>{' '}
                  {balanceUSD}
                </Heading>
              )}
              {!visibleBalance && (
                <Text color="gray.50" fontSize="3xl">
                  -----
                </Text>
              )}
            </Card.Body>

            {/* Overview Footer */}
            <Card.Footer
              display="flex"
              flexDirection="column"
              gap={2}
              alignItems="start"
            >
              <Flex align="center" gap={3}>
                <Tooltip
                  content={ToolTipComponent}
                  disabled={!ToolTipComponent}
                  contentProps={{
                    bg: 'bg.muted',
                    borderColor: 'bg.panel',
                  }}
                  showArrow
                  positioning={{ placement: 'top' }}
                >
                  <Button variant="subtle" onClick={handleNavigateToSendPage}>
                    <UpRightArrow w={4} />
                    Send
                  </Button>
                </Tooltip>
                <Button variant="subtle" onClick={onAddAssets}>
                  <HiArrowDownLeft width={4} />
                  Deposit
                </Button>
              </Flex>
              <VStack
                gap={2}
                hidden={!hasBalance}
                alignItems={{ base: 'flex-end', sm: 'flex-start' }}
              >
                {isEthBalanceLowerThanReservedAmount && isPendingSigner && (
                  <Text
                    // variant="description"
                    textAlign={{ base: 'end', sm: 'left' }}
                    fontWeight={400}
                    fontSize="xs"
                    color="primary.main"
                    onClick={onOpen}
                    cursor="pointer"
                  >
                    Not enough balance{' '}
                    <IconButton
                      bg="none"
                      _hover={{ bg: 'none' }}
                      aria-label="Open helper modal"
                      size="xs"
                      minW={4}
                      maxH={4}
                    >
                      <ErrorTooltip />
                    </IconButton>
                  </Text>
                )}
                {isPendingSigner && (
                  <Text
                    textAlign={{ base: 'end', sm: 'left' }}
                    fontSize="xs"
                    color="primary.main"
                  >
                    This vault has pending transactions.
                  </Text>
                )}
              </VStack>
            </Card.Footer>
          </>
        )}
        {isMobile ? (
          <BalanceHelperDrawer onOpenChange={onOpenChange} open={isOpen} />
        ) : (
          <BalanceHelperDialog onOpenChange={onOpenChange} open={isOpen} />
        )}
      </Card.Root>
    );
  },
);

AccountOverview.displayName = 'AccountOverview';
