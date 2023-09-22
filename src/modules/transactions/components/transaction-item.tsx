import { Badge, Box, Flex, Icon, Progress, Text } from '@chakra-ui/react';
import { bn } from 'fuels';
import { useMemo } from 'react';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { MdChevronRight } from 'react-icons/md';

import { assetsMap, SignatureUtils } from '@/modules/core';

interface Props {
  assets: {
    assetId: string;
    amount: string;
  }[];
  transaction: {
    id: string;
    name: string;
    predicate?: {
      name: string;
      minSigners: number;
    };
    witnesses: string[];
    hash: string;
  };
  hidePredicateName?: boolean;
  onClick: (transactionId: string) => void;
}

function TransactionItem({
  transaction,
  assets,
  hidePredicateName,
  onClick,
}: Props) {
  const calculateSignatures = (signers: number, requiredSigners: number) =>
    (signers * 100) / requiredSigners;
  const isFullSigned =
    transaction?.witnesses?.length >= (transaction?.predicate?.minSigners ?? 0);

  const isSigned = useMemo(() => {
    return transaction?.witnesses?.some((signature) =>
      SignatureUtils.recoverSignerAddress(signature, `${transaction.hash}`),
    );
  }, [transaction.hash, transaction?.witnesses]);

  const groupedAssets = useMemo(() => {
    return assets.reduce(
      (accumulator, asset) => {
        const { assetId, amount } = asset;
        const existingItem = accumulator.find(
          (item) => item.assetId === assetId,
        );
        if (existingItem) {
          existingItem.amount = bn
            .parseUnits(amount.toString())
            .add(bn.parseUnits(existingItem.amount))
            .format();
        } else {
          accumulator.push({
            ...asset,
            amount: bn.parseUnits(amount.toString()).format(),
          });
        }
        return accumulator;
      },
      [] as typeof assets,
    );
  }, [assets]);

  return (
    <Flex
      onClick={() => onClick(transaction.id)}
      justifyContent="space-between"
      alignItems="center"
      py={2}
      px={3}
      mb={3}
      bg="dark.100"
      borderRadius="md"
      cursor="pointer"
      _hover={{ bg: 'dark.200' }}
    >
      <Box display="flex" flexWrap="wrap" flex={2}>
        <Box flex={1} mr={2}>
          <Text color="white">
            <Text fontSize="sm" color="gray">
              Name:
            </Text>
            {transaction.name}
          </Text>
        </Box>
        {!hidePredicateName && transaction.predicate && (
          <Box flex={1}>
            <Text color="white">
              <Text fontSize="sm" color="gray">
                Predicate:
              </Text>
              {transaction.predicate.name}
            </Text>
          </Box>
        )}
        <Box flex={1}>
          <Text fontSize="sm" color="gray">
            Assets:
          </Text>
          <Box display="flex" flexDirection="column">
            {groupedAssets.map((asset) => (
              <Box key={`${asset.amount}${asset.assetId}`}>
                <Badge backgroundColor="dark.500" color="gray">
                  {asset.amount} {assetsMap[asset.assetId]?.slug}{' '}
                </Badge>
              </Box>
            ))}
          </Box>
        </Box>
        <Box flex={1}>
          <Text fontSize="sm" color="gray">
            You signed:
          </Text>
          <Box mt={1}>
            {isSigned ? (
              <Icon fontSize="md" color="brand.500" as={ImCheckboxChecked} />
            ) : (
              <Icon fontSize="md" color="grey" as={ImCheckboxUnchecked} />
            )}
          </Box>
        </Box>
        {transaction.predicate && (
          <Box mt={5} w="100%">
            <Box mb={2}>
              <Text fontSize="sm" color="gray">
                Signatures ({transaction.witnesses.length}/
                {transaction.predicate.minSigners}):
              </Text>
            </Box>
            <Progress
              min={0}
              max={100}
              value={calculateSignatures(
                transaction.witnesses.length,
                transaction.predicate.minSigners,
              )}
              backgroundColor="gray"
              colorScheme={isFullSigned ? 'brand' : 'yellow'}
              size="sm"
            />
          </Box>
        )}
      </Box>

      <Box display="flex" alignItems="center">
        <Icon color="gray" fontSize="xl" as={MdChevronRight} />
      </Box>
    </Flex>
  );
}

export { TransactionItem };
