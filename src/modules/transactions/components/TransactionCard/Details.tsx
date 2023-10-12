import {
  Avatar,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  StackProps,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { DoubleArrowIcon } from '@/components';
import {
  AddressUtils,
  AssetModel,
  assetsMap,
  Transaction,
  TransactionStatus,
} from '@/modules/core';

interface TransactionDetailsProps {
  transaction: Transaction;
}

interface AssetBoxInfoProps extends StackProps {
  asset: AssetModel;
}

const AssetBoxInfo = ({ asset, ...props }: AssetBoxInfoProps) => {
  const assetInfo = useMemo(() => assetsMap[asset.assetID], [asset.assetID]);

  return (
    <HStack
      p={5}
      spacing={8}
      borderTopWidth={1}
      borderColor="transparent"
      {...props}
    >
      <HStack spacing={4}>
        <Avatar name={assetInfo.slug} size="28px" src={assetInfo.icon} />
        <Text color="grey.500">{assetInfo.slug}</Text>
      </HStack>

      <HStack>
        <Box mt={0.5}>
          <Heading textAlign="center" variant="title-md" color="grey.200">
            - {asset?.amount}
          </Heading>
          <Text
            textAlign="center"
            variant="description"
            fontSize="sm"
            color="grey.500"
          >
            Amount sent
          </Text>
        </Box>
      </HStack>

      <Center p={2} borderRadius={5} bgColor="brand.500">
        <Icon color="black" fontSize="lg" as={DoubleArrowIcon} />
      </Center>

      <Text color="grey.200" fontSize="md">
        {AddressUtils.format(asset.to)}
      </Text>
    </HStack>
  );
};

const Details = ({ transaction }: TransactionDetailsProps) => {
  const handleViewInExplorer = async () => {
    const resume = JSON.parse(transaction.resume);
    window.open(resume.block, '_BLANK');
  };

  return (
    <VStack>
      <HStack pt={5} w="full">
        <Box hidden={!transaction?.assets?.length}>
          <Box mb={4}>
            <Text color="grey.200" fontWeight="medium">
              Transaction breakdown
            </Text>
          </Box>

          <VStack alignItems="flex-start">
            {transaction.assets.map((asset, index) => (
              <AssetBoxInfo
                key={asset.amount}
                asset={asset}
                borderColor={index > 0 ? 'dark.100' : 'transparent'}
              />
            ))}
          </VStack>

          <Box
            mt={10}
            hidden={transaction.status !== TransactionStatus.DONE}
            borderColor="dark.100"
            borderTopWidth={1}
          >
            <HStack mt={2} p={5} justifyContent="space-between">
              <Text color="grey.200">Gás Fee (ETH)</Text>
              <Text color="grey.200" fontSize="lg" fontWeight="semibold">
                -{transaction.gasUsed}
              </Text>
            </HStack>
          </Box>
        </Box>
      </HStack>
      <Button
        border="none"
        bgColor="dark.100"
        variant="secondary"
        onClick={handleViewInExplorer}
        hidden={transaction.status !== TransactionStatus.DONE}
      >
        View on Explorer
      </Button>
    </VStack>
  );
};

export { Details };
