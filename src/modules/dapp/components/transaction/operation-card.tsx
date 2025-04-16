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
import { HiOutlineDocumentText } from 'react-icons/hi2';
import { MdOutlineFileCopy } from 'react-icons/md';
import { PiArrowCircleDownLight } from 'react-icons/pi';

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
  console.log(assetsMap);
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
      : '$0.00';

  const isContract = operation.type === TxCategory.CONTRACTCALL;

  return (
    <VStack spacing="2" align="stretch" w="100%" p={2}>
      {operation.isFromCurrentAccount ? (
        <Flex align="center" gap="10px" pb="2" pl="1">
          <Avatar
            name={vault?.name}
            color="gray.100"
            bgColor="gray.700"
            boxSize="40px"
            borderRadius="4px"
            fontSize="xs"
          />
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color="white">
              {vault?.name}
            </Text>
            <Flex align="center" gap="1">
              <Text fontSize="xs" color="gray.400">
                {AddressUtils.format(operation.from.address, 6)}
              </Text>
              <Tooltip label={hasCopied ? 'Copied!' : 'Copy'} closeOnClick>
                <IconButton
                  icon={<MdOutlineFileCopy />}
                  onClick={onCopy}
                  size="xs"
                  variant="ghost"
                  aria-label="Copy address"
                  color="gray.400"
                />
              </Tooltip>
            </Flex>
          </Box>
        </Flex>
      ) : (
        <Flex align="center" gap="10px" pt="2" pl="1">
          <Avatar
            name={'Other vault'}
            color="gray.100"
            bgColor="gray.700"
            boxSize="40px"
            borderRadius="4px"
            fontSize="xs"
          />
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color="white">
              Other vault
            </Text>
            <Flex align="center" gap="1">
              <Text fontSize="xs" color="gray.400">
                {AddressUtils.format(operation.from.address, 6)}
              </Text>
              <Tooltip label="Copy" closeOnClick>
                <IconButton
                  icon={<MdOutlineFileCopy />}
                  onClick={() =>
                    navigator.clipboard.writeText(operation.from.address)
                  }
                  size="xs"
                  variant="ghost"
                  aria-label="Copy address"
                  color="gray.400"
                />
              </Tooltip>
            </Flex>
          </Box>
        </Flex>
      )}

      <Box position="relative" ml="20px" pl="4">
        <Box
          position="absolute"
          top="-3"
          bottom="-3"
          left="3px"
          width="2px"
          bg="gray.600"
          zIndex="0"
        />
        <VStack spacing="1" align="flex-start" position="relative">
          <Flex align="center" gap="2">
            <Icon
              as={isContract ? HiOutlineDocumentText : PiArrowCircleDownLight}
              color="orange.400"
              boxSize="20px"
              borderRadius="full"
              filter="drop-shadow(0 0 1px rgba(0,0,0,0.2))"
            />
            <Text fontSize="sm" color="orange.400" fontWeight="medium">
              {isContract ? 'Calling contract' : 'Sending funds'}
            </Text>
          </Flex>

          {!isContract && (
            <Flex align="center" gap="2" pt="1">
              {asset?.icon && (
                <Box boxSize="20px">
                  <img
                    src={asset.icon}
                    alt="Asset icon"
                    style={{ width: '100%', height: '100%' }}
                  />
                </Box>
              )}
              <Text fontSize="sm" color="white" fontWeight="medium">
                {bn(operation?.assets?.[0]?.amount || 0).formatUnits()}{' '}
                {asset?.slug}
              </Text>
              <Text fontSize="sm" color="gray.400" fontWeight="medium">
                ~ {formatted}
              </Text>
            </Flex>
          )}
        </VStack>
      </Box>

      {operation.isToCurrentAccount ? (
        <Flex align="center" gap="10px" pb="2" pl="1">
          <Avatar
            name={vault?.name}
            color="gray.100"
            bgColor="gray.700"
            boxSize="40px"
            borderRadius="4px"
            fontSize="xs"
          />
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color="white">
              {vault?.name}
            </Text>
            <Flex align="center" gap="1">
              <Text fontSize="xs" color="gray.400">
                {AddressUtils.format(operation.to.address, 6)}
              </Text>
              <Tooltip label={hasCopied ? 'Copied!' : 'Copy'} closeOnClick>
                <IconButton
                  icon={<MdOutlineFileCopy />}
                  onClick={onCopy}
                  size="xs"
                  variant="ghost"
                  aria-label="Copy address"
                  color="gray.400"
                />
              </Tooltip>
            </Flex>
          </Box>
        </Flex>
      ) : (
        <Flex align="center" gap="10px" pt="2" pl="1">
          <Avatar
            name={'Other vault'}
            color="gray.100"
            bgColor="gray.700"
            boxSize="40px"
            borderRadius="4px"
            fontSize="xs"
          />
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color="white">
              Other vault
            </Text>
            <Flex align="center" gap="1">
              <Text fontSize="xs" color="gray.400">
                {AddressUtils.format(operation.to.address, 6)}
              </Text>
              <Tooltip label="Copy" closeOnClick>
                <IconButton
                  icon={<MdOutlineFileCopy />}
                  onClick={() =>
                    navigator.clipboard.writeText(operation.to.address)
                  }
                  size="xs"
                  variant="ghost"
                  aria-label="Copy address"
                  color="gray.400"
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
