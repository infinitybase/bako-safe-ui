import { CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  Center,
  HStack,
  Icon,
  IconButton,
  StackProps,
  Text,
  useClipboard,
} from '@chakra-ui/react';
import { ITransferAsset } from 'bakosafe';
import { bn, Operation } from 'fuels';
import { useMemo } from 'react';
import { IoIosCheckmark } from 'react-icons/io';

import { UnknownIcon } from '@/components';
import { DeployIcon } from '@/components/icons/tx-deploy';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { assetsMap } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface DeploymentInfoProps extends StackProps {
  operation: Operation;
}

const DeploymentInfo = ({ operation, ...props }: DeploymentInfoProps) => {
  const {
    tokensUSD,
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  const contractId = operation.to!.address;
  const asset = useMemo(() => {
    const operationCoin = operation.assetsSent![0];
    return {
      ...operationCoin,
      to: contractId,
      amount: bn(operationCoin.amount).format({ precision: 6 }),
    };
  }, [contractId, operation.assetsSent]);
  const assetInfo = useMemo(
    () => (asset?.assetId ? assetsMap[asset?.assetId] : null),
    [asset?.assetId],
  );

  const clipboard = useClipboard(contractId);
  const txUSDAmount = useTxAmountToUSD(
    [asset as ITransferAsset],
    tokensUSD?.isLoading,
    tokensUSD?.data,
  );

  return (
    <HStack
      py={2}
      borderTopWidth={1}
      borderBottomWidth={1}
      borderColor="grey.950"
      spacing={{ base: 1, sm: 1 }}
      maxW="full"
      w="full"
      position="relative"
      {...props}
    >
      {assetInfo && (
        <HStack spacing={{ base: 2, sm: 3 }}>
          <Icon
            key={asset.assetId}
            w={{ base: 6, sm: 6 }}
            h={{ base: 6, sm: 6 }}
            as={assetsMap[asset.assetId]?.icon ?? UnknownIcon}
          />
          <Text fontSize="sm" color="grey.500">
            {assetInfo.slug}
          </Text>
        </HStack>
      )}

      <Box mt={0.5} w="full">
        <Text
          textAlign="center"
          variant={isMobile ? 'title-sm' : 'title-md'}
          color="grey.75"
          fontSize="sm"
        >
          {asset?.amount}
        </Text>
        <Text
          textAlign="center"
          variant="description"
          fontSize="xs"
          color="grey.500"
        >
          ${txUSDAmount}
        </Text>
      </Box>

      <Center
        mr={3}
        p={{ base: 1.5, sm: 3 }}
        borderRadius={5}
        bgColor="grey.825"
        borderWidth={1}
        borderColor="grey.925"
        boxSize="30px"
      >
        <Icon color="grey.250" fontSize="12.8px" as={DeployIcon} />
      </Center>

      <HStack
        justifyContent="end"
        pr="40px"
        maxW="full"
        w="full"
        overflow="hidden"
      >
        <Text
          ml="2px"
          maxW={{ base: '200px', sm: '50px', md: '175px' }}
          fontSize="sm"
          color="grey.75"
          textOverflow="ellipsis"
          isTruncated
        >
          {contractId}
        </Text>
        <IconButton
          variant="icon"
          aria-label="Copy"
          position="absolute"
          right={0}
          background={{ base: 'dark.950', md: 'none' }}
          icon={
            <Icon
              as={clipboard.hasCopied ? IoIosCheckmark : CopyIcon}
              color={clipboard.hasCopied ? 'success.700' : 'grey.200'}
              fontSize={clipboard.hasCopied ? 30 : 16}
            />
          }
          onClick={clipboard.onCopy}
        />
      </HStack>
    </HStack>
  );
};

export { DeploymentInfo };
