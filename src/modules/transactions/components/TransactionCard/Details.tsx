import {
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  StackProps,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ITransaction, TransactionStatus } from 'bsafe';
import React, { useMemo } from 'react';

import { DoubleArrowIcon } from '@/components';
import { AlertIcon } from '@/components/icons/alert';
import { AddressUtils, AssetModel, assetsMap } from '@/modules/core';

interface TransactionDetailsProps {
  transaction: ITransaction;
}

interface AssetBoxInfoProps extends StackProps {
  asset: AssetModel;
}

const AssetBoxInfo = ({ asset, ...props }: AssetBoxInfoProps) => {
  const assetInfo = useMemo(() => assetsMap[asset.assetID], [asset.assetID]);

  if (!assetInfo) return null;

  return (
    <HStack
      p={5}
      spacing={8}
      w="full"
      borderTopWidth={1}
      borderColor="transparent"
      {...props}
    >
      <HStack spacing={4}>
        <Avatar name={assetInfo.slug} size="28px" src={assetInfo.icon} />
        <Text color="grey.500">{assetInfo.slug}</Text>
      </HStack>

      <HStack>
        <Box mt={0.5} w={110}>
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
        {asset.recipientNickname ?? AddressUtils.format(asset.to)}
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

          <Card
            bgColor="dark.300"
            borderColor="dark.100"
            borderRadius={10}
            px={5}
            py={4}
            borderWidth="1px"
          >
            <Text fontSize="sm" color="grey.500">
              Requesting a transaction from:
            </Text>

            <Divider borderColor="dark.100" mt={3} mb={5} />

            <HStack width="100%" alignItems="center" spacing={4}>
              <Avatar
                variant="roundedSquare"
                color="white"
                bgColor="dark.150"
                // TODO: Add dynamic name
                name="Static Name"
              />
              <VStack alignItems="flex-start" spacing={0}>
                {/* TODO: Add dynamic name */}
                <Text variant="subtitle">Static Name</Text>
                <Text color="brand.500" variant="description">
                  {/* TODO: Add dynamic name */}
                  localhost:5173
                </Text>
              </VStack>
            </HStack>
          </Card>

          <HStack
            bg="warning.700"
            borderColor="warning.700"
            borderWidth="1px"
            borderRadius={10}
            mt={8}
            py={4}
            px={8}
          >
            <Icon as={AlertIcon} color="warning.600" fontSize={28} />

            <VStack spacing={0} alignItems="flex-start" ml={2}>
              <Text fontWeight="bold" color="warning.600">
                Double check it!
              </Text>
              <Text color="grey.200">
                When I hear the buzz of the little world...
              </Text>
            </VStack>
          </HStack>

          <Divider borderColor="dark.100" mt={8} />

          <VStack alignItems="flex-start">
            {transaction.assets.map((asset, index) => (
              <AssetBoxInfo
                key={asset.amount}
                asset={{
                  assetID: asset.assetId,
                  amount: asset.amount,
                  to: asset.to,
                  transactionID: transaction.id,
                }}
                borderColor={index > 0 ? 'dark.100' : 'transparent'}
              />
            ))}
          </VStack>

          <Box
            mt={10}
            hidden={transaction.status !== TransactionStatus.SUCCESS}
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
        hidden={transaction.status !== TransactionStatus.SUCCESS}
      >
        View on Explorer
      </Button>
    </VStack>
  );
};

export { Details };
