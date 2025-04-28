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

import { AddressUtils, AssetMap } from '@/modules/core';
import { IuseTokensUSDAmountRequestReturn } from '@/modules/home';
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

type AddressDisplayProps = {
  address: string;
  name: string;
  isCurrentAccount: boolean;
  vaultAddress?: string;
  onCopy: () => void;
  hasCopied: boolean;
};

const AddressDisplay = ({
  address,
  name,
  isCurrentAccount,
  vaultAddress,
  onCopy,
  hasCopied,
}: AddressDisplayProps) => {
  const handleCopy = () => {
    if (isCurrentAccount && vaultAddress) {
      onCopy();
    } else {
      navigator.clipboard.writeText(address);
    }
  };

  return (
    <Flex align="center" gap={3} pb={0} pl={1}>
      <Avatar
        name={name}
        color="grey.250"
        bgColor="grey.950"
        boxSize={10}
        borderRadius="4px"
        fontSize="xs"
        zIndex={1}
      />
      <Box pl={2} pt={2}>
        <Text fontSize="sm" fontWeight="semibold" color="white">
          {name}
        </Text>
        <Flex align="center" gap={1}>
          <Text fontSize="xs" color="grey.250">
            {AddressUtils.format(address, 6)}
          </Text>
          <Tooltip label={hasCopied ? 'Copied!' : 'Copy'} closeOnClick>
            <IconButton
              icon={<PiCopyThin />}
              onClick={handleCopy}
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
  );
};

type OperationArrowProps = {
  label: string;
};

const OperationArrow = ({ label }: OperationArrowProps) => (
  <Box position="relative" ml={5} pl={4} my={0}>
    <Box
      position="absolute"
      top="-45px"
      bottom="-70px"
      left="3px"
      width="2px"
      bg="grey.950"
      zIndex="0"
    />
    <Flex align="center" position="relative" pl={2}>
      <Icon
        as={PiArrowCircleDownLight}
        color="brand.700"
        boxSize="20px"
        position="absolute"
        left="-22px"
        bg="dark.200"
        borderRadius="full"
        filter="drop-shadow(0 0 1px rgba(0,0,0,0.2))"
      />
      <Text fontSize="sm" color="brand.700" fontWeight="medium" pl={6}>
        {label}
      </Text>
    </Flex>
  </Box>
);

type AssetDisplayProps = {
  operation: SimplifiedOperation;
  assetsMap: AssetMap;
  tokensUSD: IuseTokensUSDAmountRequestReturn;
};

const AssetDisplay = ({
  operation,
  assetsMap,
  tokensUSD,
}: AssetDisplayProps) => {
  const asset = Object.values(assetsMap).find(
    (a) => a.assetId === operation?.assets?.[0]?.assetId,
  );

  const formatUsdEstimate = (amount: string, assetId: string) => {
    if (!amount || !assetId) return '$0.00';
    const price = tokensUSD.data?.[assetId]?.usdAmount ?? 0;
    const estimated = parseFloat(amount) * price;
    return estimated.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    });
  };

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

  const formatted = operation.assets?.[0]
    ? formatUsdEstimate(
        bn(operation.assets[0].amount).formatUnits(),
        operation.assets[0].assetId,
      )
    : '$0.00';

  const isContract = operation.type === TxCategory.CONTRACTCALL;
  const hasNonZeroAmount = assetOperation.gt(0.00000001);

  if (isContract && !hasNonZeroAmount) return null;

  const assetId = operation.assets?.[0]?.assetId || 'UNKNOWN';

  return (
    <Box ml={10} pl={7} mt={-6}>
      <Flex align="center" gap={2}>
        <Box w={4} h={4} flexShrink={0}>
          {assetsInfo?.icon ? (
            <img
              src={assetsInfo.icon}
              alt="Asset icon"
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <Box w="full" h="full" bg="gray.600" borderRadius="sm" />
          )}
        </Box>
        <Text fontSize="sm" color="grey.75" fontWeight="medium">
          {assetAmount === '0.000000001' ? '' : assetAmount}{' '}
          {assetsInfo?.slug === 'UNK' || !assetsInfo?.slug
            ? `NFT ${AddressUtils.format(assetId, 8)}`
            : assetsInfo.slug}
        </Text>
        {formatted !== '$0.00' && (
          <Text fontSize="sm" color="grey.425" fontWeight="medium">
            {`~ ${formatted}`}
          </Text>
        )}
      </Flex>
    </Box>
  );
};

const OperationChain = ({
  operations,
  vault,
  onCopy,
  hasCopied,
  assetsMap,
  tokensUSD,
}: {
  operations: SimplifiedOperation[];
  vault?: UseTransactionSocket['vault'];
  onCopy: () => void;
  hasCopied: boolean;
  assetsMap: AssetMap;
  tokensUSD: IuseTokensUSDAmountRequestReturn;
}) => {
  const chain: SimplifiedOperation[] = [operations[0]];

  for (let i = 1; i < operations.length; i++) {
    const prev = chain[chain.length - 1];
    const curr = operations[i];

    if (prev.to.address.toLowerCase() === curr.from.address.toLowerCase()) {
      chain.push(curr);
    } else {
      break;
    }
  }

  const last = chain[chain.length - 1];

  return (
    <>
      {chain.map((op, i) => (
        <React.Fragment key={i}>
          <AddressDisplay
            address={op.from.address}
            name={op.isFromCurrentAccount ? vault?.name || 'Vault' : 'Unknown'}
            isCurrentAccount={op.isFromCurrentAccount ?? false}
            vaultAddress={vault?.address}
            onCopy={onCopy}
            hasCopied={hasCopied}
          />
          <OperationArrow
            label={
              op.type === TxCategory.CONTRACTCALL
                ? 'Calling contract'
                : 'Sending funds'
            }
          />
          <AssetDisplay
            operation={op}
            assetsMap={assetsMap}
            tokensUSD={tokensUSD}
          />
        </React.Fragment>
      ))}
      <AddressDisplay
        address={last.to.address}
        name={last.isToCurrentAccount ? vault?.name || 'Vault' : 'Unknown'}
        isCurrentAccount={last.isToCurrentAccount ?? false}
        vaultAddress={vault?.address}
        onCopy={onCopy}
        hasCopied={hasCopied}
      />
    </>
  );
};

function DappTransactionOperationCard({
  operation,
  vault,
  mainOp,
}: DappTransactionCardProps) {
  const { tokensUSD, assetsMap } = useWorkspaceContext();
  const { onCopy, hasCopied } = useClipboard(vault?.address || '');

  if (mainOp && operation.operations && operation.operations.length > 0) {
    return (
      <VStack spacing={7} align="stretch" w="100%" p={2}>
        <OperationChain
          operations={operation.operations}
          vault={vault}
          onCopy={onCopy}
          hasCopied={hasCopied}
          assetsMap={assetsMap}
          tokensUSD={tokensUSD}
        />
      </VStack>
    );
  }

  return (
    <VStack spacing={7} align="stretch" w="100%" p={2}>
      <AddressDisplay
        address={operation.from.address}
        name={
          operation.isFromCurrentAccount ? vault?.name || 'Vault' : 'Unknown'
        }
        isCurrentAccount={operation.isFromCurrentAccount ?? false}
        vaultAddress={vault?.address}
        onCopy={onCopy}
        hasCopied={hasCopied}
      />
      <OperationArrow
        label={
          operation.type === TxCategory.CONTRACTCALL
            ? 'Calling contract'
            : 'Sending funds'
        }
      />
      <AssetDisplay
        operation={operation}
        assetsMap={assetsMap}
        tokensUSD={tokensUSD}
      />
      <AddressDisplay
        address={operation.to.address}
        name={operation.isToCurrentAccount ? vault?.name || 'Vault' : 'Unknown'}
        isCurrentAccount={operation.isToCurrentAccount ?? false}
        vaultAddress={vault?.address}
        onCopy={onCopy}
        hasCopied={hasCopied}
      />
    </VStack>
  );
}

export { DappTransactionOperationCard };
