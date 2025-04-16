import {
  Avatar,
  Box,
  Flex,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useClipboard,
  VStack,
} from '@chakra-ui/react';
import { bn } from 'fuels';
import { PiArrowCircleDownLight, PiCopyThin } from 'react-icons/pi';

import { AddressUtils } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { UseTransactionSocket } from '../../hooks';
import {
  SimplifiedOperation,
  TxCategory,
} from '../../services/simplify-transaction';

type DappTransactionCardProps = {
  operation: SimplifiedOperation;
  vault?: UseTransactionSocket['vault'];
};

function DappTransactionOperationCard({
  operation,
  vault,
}: DappTransactionCardProps) {
  const { tokensUSD, assetsMap } = useWorkspaceContext();
  const { onCopy, hasCopied } = useClipboard(vault?.address || '');

  const getAssetPrice = (assetId: string) => {
    return tokensUSD.data?.[assetId]?.usdAmount ?? 0;
  };

  const asset = Object.values(assetsMap).find(
    (a) => a.assetId === operation?.assets?.[0]?.assetId,
  );

  const formatUsdEstimate = (amount: string, assetId: string) => {
    if (!amount || !assetId) return '$0.00';
    const price = getAssetPrice(assetId);
    const estimated = parseFloat(amount) * price;
    return estimated.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    });
  };

  const formatted =
    operation.assets && operation.assets[0]
      ? formatUsdEstimate(
          bn(operation.assets[0].amount).formatUnits(),
          operation.assets[0].assetId,
        )
      : null;

  const isContract = operation.type === TxCategory.CONTRACTCALL;

  const avatarColor = '#AAA6A1';
  const avatarBg = '#353230';
  const addressColor = '#AAA6A1';
  const nameColor = 'white';
  const iconColor = '#F5A623';
  const textColor = '#CFCCC9';
  const usdColor = '#868079';
  const lineColor = '#353230';

  return (
    <VStack spacing="8" align="stretch" w="100%" p={2}>
      {operation.isFromCurrentAccount ? (
        <Flex align="center" gap="10px" pb="2" pl="1">
          <Avatar
            name={vault?.name}
            color={avatarColor}
            bgColor={avatarBg}
            boxSize="40px"
            borderRadius="4px"
            fontSize="xs"
            zIndex={1}
          />
          <Box pl={2}>
            <Text fontSize="sm" fontWeight="semibold" color={nameColor}>
              {vault?.name}
            </Text>
            <Flex align="center" gap="1">
              <Text fontSize="xs" color={addressColor}>
                {AddressUtils.format(operation.from.address, 6)}
              </Text>
              <Tooltip label={hasCopied ? 'Copied!' : 'Copy'} closeOnClick>
                <IconButton
                  icon={<PiCopyThin />}
                  onClick={onCopy}
                  size="xs"
                  variant="ghost"
                  aria-label="Copy address"
                  color={addressColor}
                  _hover={{ background: 'transparent' }}
                  _active={{ background: 'transparent' }}
                  _focus={{ boxShadow: 'none' }}
                />
              </Tooltip>
            </Flex>
          </Box>
        </Flex>
      ) : (
        <Flex align="center" gap="10px" pt="2" pl="1">
          <Avatar
            name={'Other vault'}
            color={avatarColor}
            bgColor={avatarBg}
            boxSize="40px"
            borderRadius="4px"
            fontSize="xs"
            zIndex={1}
          />
          <Box pl={2}>
            <Text fontSize="sm" fontWeight="semibold" color={nameColor}>
              Other vault
            </Text>
            <Flex align="center" gap="1">
              <Text fontSize="xs" color={addressColor}>
                {AddressUtils.format(operation.from.address, 6)}
              </Text>
              <Tooltip label="Copy" closeOnClick>
                <IconButton
                  icon={<PiCopyThin />}
                  onClick={() =>
                    navigator.clipboard.writeText(operation.from.address)
                  }
                  size="xs"
                  variant="ghost"
                  aria-label="Copy address"
                  color={addressColor}
                  _hover={{ background: 'transparent' }}
                  _active={{ background: 'transparent' }}
                  _focus={{ boxShadow: 'none' }}
                />
              </Tooltip>
            </Flex>
          </Box>
        </Flex>
      )}

      <Box position="relative" ml="20px" pl="4">
        <Box
          position="absolute"
          top="-50px"
          bottom="-50px"
          left="3px"
          width="2px"
          bg={lineColor}
          zIndex="0"
        />
        <VStack
          spacing="3"
          align="flex-start"
          position="relative"
          pt="1"
          pb="1"
        >
          <Flex align="center" gap="3" position="relative" zIndex="1">
            <Icon
              as={PiArrowCircleDownLight}
              color={iconColor}
              boxSize="20px"
              position="absolute"
              left="-22px"
              top="50%"
              bg="dark.200"
              transform="translateY(-50%)"
              borderRadius="full"
              filter="drop-shadow(0 0 1px rgba(0,0,0,0.2))"
            />
            <Text fontSize="sm" color={iconColor} fontWeight="medium" pl={6}>
              {isContract ? 'Calling contract' : 'Sending funds'}
            </Text>
          </Flex>

          {(!isContract ||
            Number(bn(operation?.assets?.[0]?.amount || 0)) > 0.00000001) && (
            <Flex align="center" gap="3" pt="1" pl={asset?.icon ? 6 : 0}>
              <Box width="16px" height="16px">
                {asset?.icon ? (
                  <img
                    src={asset.icon}
                    alt="Asset icon"
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : null}
              </Box>
              <Text fontSize="sm" color={textColor} fontWeight="medium">
                {bn(operation?.assets?.[0]?.amount || 0).formatUnits() ===
                '0.000000001'
                  ? '1'
                  : bn(operation?.assets?.[0]?.amount || 0).formatUnits()}{' '}
                {asset?.slug || 'Unknown asset'}
              </Text>
              {formatted !== '$0.00' && (
                <Text fontSize="sm" color={usdColor} fontWeight="medium">
                  ~ {formatted}
                </Text>
              )}
            </Flex>
          )}
        </VStack>
      </Box>

      {operation.isToCurrentAccount ? (
        <Flex align="center" gap="10px" pb="2" pl="1">
          <Avatar
            name={vault?.name}
            color={avatarColor}
            bgColor={avatarBg}
            boxSize="40px"
            borderRadius="4px"
            fontSize="xs"
            zIndex={1}
          />
          <Box pl={2}>
            <Text fontSize="sm" fontWeight="semibold" color={nameColor}>
              {vault?.name}
            </Text>
            <Flex align="center" gap="1">
              <Text fontSize="xs" color={addressColor}>
                {AddressUtils.format(operation.to.address, 6)}
              </Text>
              <Tooltip label={hasCopied ? 'Copied!' : 'Copy'} closeOnClick>
                <IconButton
                  icon={<PiCopyThin />}
                  onClick={onCopy}
                  size="xs"
                  variant="ghost"
                  aria-label="Copy address"
                  color={addressColor}
                  _hover={{ background: 'transparent' }}
                  _active={{ background: 'transparent' }}
                  _focus={{ boxShadow: 'none' }}
                />
              </Tooltip>
            </Flex>
          </Box>
        </Flex>
      ) : (
        <Flex align="center" gap="10px" pt="2" pl="1">
          <Avatar
            name={'Other vault'}
            color={avatarColor}
            bgColor={avatarBg}
            boxSize="40px"
            borderRadius="4px"
            fontSize="xs"
            zIndex={1}
          />
          <Box pl={2}>
            <Text fontSize="sm" fontWeight="semibold" color={nameColor}>
              Other vault
            </Text>
            <Flex align="center" gap="1">
              <Text fontSize="xs" color={addressColor}>
                {AddressUtils.format(operation.to.address, 6)}
              </Text>
              <Tooltip label="Copy" closeOnClick>
                <IconButton
                  icon={<PiCopyThin />}
                  onClick={() =>
                    navigator.clipboard.writeText(operation.to.address)
                  }
                  size="xs"
                  variant="ghost"
                  aria-label="Copy address"
                  color={addressColor}
                  _hover={{ background: 'transparent' }}
                  _active={{ background: 'transparent' }}
                  _focus={{ boxShadow: 'none' }}
                />
              </Tooltip>
            </Flex>
          </Box>
        </Flex>
      )}
    </VStack>
  );
}

export { DappTransactionOperationCard };
