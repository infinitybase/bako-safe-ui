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
import React, { useMemo } from 'react';
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
  mainOp: boolean;
};

function DappTransactionOperationCard({
  operation,
  vault,
  mainOp,
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
  const assetOperation = useMemo(
    () => bn(operation?.assets?.[0]?.amount || 0),
    [operation],
  );

  const assetsInfo = asset
    ? (assetsMap?.[asset.assetId] ?? assetsMap?.['UNKNOWN'])
    : assetsMap?.['UNKNOWN'];

  const assetAmount = assetOperation.format({
    units: assetsInfo?.units,
  });

  const isContract = operation.type === TxCategory.CONTRACTCALL;

  const hasNonZeroAmount = assetOperation.gt(0.00000001);
  console.log(operation, mainOp, asset?.assetId);

  if (mainOp) {
    return (
      <VStack spacing="8" align="stretch" w="100%" p={2}>
        {(() => {
          const ops = operation.operations;

          if (!ops || ops.length === 0) return null;

          const chain: typeof ops = [ops[0]];

          for (let i = 1; i < ops.length; i++) {
            const prev = chain[chain.length - 1];
            const curr = ops[i];

            if (
              prev.to.address.toLowerCase() === curr.from.address.toLowerCase()
            ) {
              chain.push(curr);
            } else {
              break;
            }
          }

          const last = chain[chain.length - 1];

          const renderOp = (op: any) => {
            const isContract = op.type === TxCategory.CONTRACTCALL;
            const opAsset = op.assets?.[0];
            const assetOpAmount = bn(opAsset?.amount || 0);
            const hasNonZeroAmount = assetOpAmount.gt(0.00000001);

            const opAssetInfo = opAsset
              ? (assetsMap?.[opAsset.assetId] ?? assetsMap?.['UNKNOWN'])
              : assetsMap?.['UNKNOWN'];

            const opFormattedAmount = opAssetInfo
              ? assetOpAmount.format({ units: opAssetInfo.units })
              : null;

            const formattedUsd = opAsset
              ? formatUsdEstimate(
                  bn(opAsset.amount).formatUnits(),
                  opAsset.assetId,
                )
              : '$0.00';

            return (
              <>
                <Flex align="center" gap={2.5} pb={1} pl={1}>
                  <Avatar
                    name={op.isFromCurrentAccount ? vault?.name : 'Other vault'}
                    color="grey.250"
                    bgColor="grey.950"
                    boxSize={10}
                    borderRadius="4px"
                    fontSize="xs"
                    zIndex={1}
                  />
                  <Box pl={2}>
                    <Text fontSize="sm" fontWeight="semibold" color="white">
                      {op.isFromCurrentAccount ? vault?.name : 'Other vault'}
                    </Text>
                    <Flex align="center" gap={1}>
                      <Text fontSize="xs" color="grey.250">
                        {AddressUtils.format(op.from.address, 6)}
                      </Text>
                      <Tooltip
                        label={hasCopied ? 'Copied!' : 'Copy'}
                        closeOnClick
                      >
                        <IconButton
                          icon={<PiCopyThin />}
                          onClick={
                            op.isFromCurrentAccount
                              ? onCopy
                              : () =>
                                  navigator.clipboard.writeText(op.from.address)
                          }
                          size="xs"
                          variant="ghost"
                          aria-label="Copy address"
                          color="grey.250"
                          _hover={{ background: 'transparent' }}
                          _active={{ background: 'transparent' }}
                          _focus={{ boxShadow: 'none' }}
                        />
                      </Tooltip>
                    </Flex>
                  </Box>
                </Flex>

                <Box position="relative" ml={5} pl={4}>
                  <Box
                    position="absolute"
                    top="-50px"
                    bottom="-50px"
                    left="3px"
                    width="2px"
                    bg="grey.950"
                    zIndex="0"
                  />
                  <VStack
                    spacing={3}
                    align="flex-start"
                    position="relative"
                    pt={1}
                    pb={1}
                  >
                    <Flex align="center" gap={3} position="relative" zIndex={1}>
                      <Icon
                        as={PiArrowCircleDownLight}
                        color="brand.700"
                        boxSize="20px"
                        position="absolute"
                        left="-22px"
                        top="55%"
                        bg="dark.200"
                        transform="translateY(-50%)"
                        borderRadius="full"
                        filter="drop-shadow(0 0 1px rgba(0,0,0,0.2))"
                      />
                      <Text
                        fontSize="sm"
                        color="brand.700"
                        fontWeight="medium"
                        pl={6}
                      >
                        {isContract ? 'Calling contract' : 'Sending funds'}
                      </Text>
                    </Flex>

                    {(!isContract || hasNonZeroAmount) && (
                      <Flex
                        align="center"
                        gap={2}
                        pt={1}
                        pl={opAssetInfo?.icon ? 6 : 0}
                      >
                        <Box w={4} h={4}>
                          {opAssetInfo?.icon && (
                            <img
                              src={opAssetInfo.icon}
                              alt="Asset icon"
                              style={{ width: '100%', height: '100%' }}
                            />
                          )}
                        </Box>
                        <Text fontSize="sm" color="grey.75" fontWeight="medium">
                          {opFormattedAmount === '0.000000001'
                            ? ''
                            : opFormattedAmount}{' '}
                          {opAssetInfo?.slug === 'UNK'
                            ? opAsset?.assetId
                              ? `NFT ${AddressUtils.format(opAsset?.assetId ?? '', 10)}`
                              : 'NFT UNK'
                            : opAssetInfo?.slug}
                        </Text>
                        {formattedUsd !== '$0.00' && (
                          <Text
                            fontSize="sm"
                            color="grey.425"
                            fontWeight="medium"
                          >
                            {`~ ${formattedUsd}`}
                          </Text>
                        )}
                      </Flex>
                    )}
                  </VStack>
                </Box>
              </>
            );
          };

          return (
            <>
              {chain.map((op, i) => (
                <React.Fragment key={i}>{renderOp(op)}</React.Fragment>
              ))}
              <Flex align="center" gap={2.5} pb={2} pl={1}>
                <Avatar
                  name={last.isToCurrentAccount ? vault?.name : 'Other vault'}
                  color="grey.250"
                  bgColor="grey.950"
                  boxSize={10}
                  borderRadius="4px"
                  fontSize="xs"
                  zIndex={1}
                />
                <Box pl={2}>
                  <Text fontSize="sm" fontWeight="semibold" color="white">
                    {last.isToCurrentAccount ? vault?.name : 'Other vault'}
                  </Text>
                  <Flex align="center" gap={1}>
                    <Text fontSize="xs" color="grey.250">
                      {AddressUtils.format(last.to.address, 6)}
                    </Text>
                    <Tooltip
                      label={hasCopied ? 'Copied!' : 'Copy'}
                      closeOnClick
                    >
                      <IconButton
                        icon={<PiCopyThin />}
                        onClick={
                          last.isToCurrentAccount
                            ? onCopy
                            : () =>
                                navigator.clipboard.writeText(last.to.address)
                        }
                        size="xs"
                        variant="ghost"
                        aria-label="Copy address"
                        color="grey.250"
                        _hover={{ background: 'transparent' }}
                        _active={{ background: 'transparent' }}
                        _focus={{ boxShadow: 'none' }}
                      />
                    </Tooltip>
                  </Flex>
                </Box>
              </Flex>
            </>
          );
        })()}
      </VStack>
    );
  }

  return (
    <VStack spacing="8" align="stretch" w="100%" p={2}>
      <Flex align="center" gap={2.5} pb={1} pl={1}>
        <Avatar
          name={operation.isFromCurrentAccount ? vault?.name : 'Other vault'}
          color="grey.250"
          bgColor="grey.950"
          boxSize={10}
          borderRadius="4px"
          fontSize="xs"
          zIndex={1}
        />
        <Box pl={2}>
          <Text fontSize="sm" fontWeight="semibold" color="white">
            {operation.isFromCurrentAccount ? vault?.name : 'Other vault'}
          </Text>
          <Flex align="center" gap={1}>
            <Text fontSize="xs" color="grey.250">
              {AddressUtils.format(operation.from.address, 6)}
            </Text>
            <Tooltip label={hasCopied ? 'Copied!' : 'Copy'} closeOnClick>
              <IconButton
                icon={<PiCopyThin />}
                onClick={
                  operation.isFromCurrentAccount
                    ? onCopy
                    : () =>
                        navigator.clipboard.writeText(operation.from.address)
                }
                size="xs"
                variant="ghost"
                aria-label="Copy address"
                color="grey.250"
                _hover={{ background: 'transparent' }}
                _active={{ background: 'transparent' }}
                _focus={{ boxShadow: 'none' }}
              />
            </Tooltip>
          </Flex>
        </Box>
      </Flex>

      <Box position="relative" ml={5} pl={4}>
        <Box
          position="absolute"
          top="-50px"
          bottom="-50px"
          left="3px"
          width="2px"
          bg="grey.950"
          zIndex="0"
        />
        <VStack
          spacing={3}
          align="flex-start"
          position="relative"
          pt={1}
          pb={1}
        >
          <Flex align="center" gap={3} position="relative" zIndex={1}>
            <Icon
              as={PiArrowCircleDownLight}
              color="brand.700"
              boxSize="20px"
              position="absolute"
              left="-22px"
              top="55%"
              bg="dark.200"
              transform="translateY(-50%)"
              borderRadius="full"
              filter="drop-shadow(0 0 1px rgba(0,0,0,0.2))"
            />
            <Text fontSize="sm" color="brand.700" fontWeight="medium" pl={6}>
              {isContract ? 'Calling contract' : 'Sending funds'}
            </Text>
          </Flex>

          {(!isContract || hasNonZeroAmount) && (
            <Flex align="center" gap={2} pt={1} pl={asset?.icon ? 6 : 0}>
              <Box w={4} h={4}>
                {asset?.icon && (
                  <img
                    src={asset.icon}
                    alt="Asset icon"
                    style={{ width: '100%', height: '100%' }}
                  />
                )}
              </Box>
              <Text fontSize="sm" color="grey.75" fontWeight="medium">
                {assetAmount === '0.000000001' ? '' : assetAmount}{' '}
                {assetsInfo?.slug === 'UNK'
                  ? asset?.assetId
                    ? `NFT ${AddressUtils.format(asset?.assetId ?? '', 10)}`
                    : 'NFT UNK'
                  : assetsInfo?.slug}
              </Text>
              {formatted !== '$0.00' && (
                <Text fontSize="sm" color="grey.425" fontWeight="medium">
                  {`~ ${formatted}`}
                </Text>
              )}
            </Flex>
          )}
        </VStack>
      </Box>

      <Flex align="center" gap={2.5} pb={1} pl={1}>
        <Avatar
          name={operation.isToCurrentAccount ? vault?.name : 'Other vault'}
          color="grey.250"
          bgColor="grey.950"
          boxSize={10}
          borderRadius="4px"
          fontSize="xs"
          zIndex={1}
        />
        <Box pl={2}>
          <Text fontSize="sm" fontWeight="semibold" color="white">
            {operation.isToCurrentAccount ? vault?.name : 'Other vault'}
          </Text>
          <Flex align="center" gap={1}>
            <Text fontSize="xs" color="grey.250">
              {AddressUtils.format(operation.to.address, 6)}
            </Text>
            <Tooltip label={hasCopied ? 'Copied!' : 'Copy'} closeOnClick>
              <IconButton
                icon={<PiCopyThin />}
                onClick={
                  operation.isToCurrentAccount
                    ? onCopy
                    : () => navigator.clipboard.writeText(operation.to.address)
                }
                size="xs"
                variant="ghost"
                aria-label="Copy address"
                color="grey.250"
                _hover={{ background: 'transparent' }}
                _active={{ background: 'transparent' }}
                _focus={{ boxShadow: 'none' }}
              />
            </Tooltip>
          </Flex>
        </Box>
      </Flex>
    </VStack>
  );
}

export { DappTransactionOperationCard };
