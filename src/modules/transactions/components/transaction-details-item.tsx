import { Box, Flex, Text } from '@chakra-ui/react';
import { bn } from 'fuels';
import { useMemo } from 'react';

interface Props {
  name?: string;
  slug: string;
  amount: string;
  assetId: string;
  to: string;
}

function TransactionDetailsItem({ assetId, amount, slug, to }: Props) {
  const assetAmount = useMemo(() => {
    return bn(bn.parseUnits(amount.toString())).format({ precision: 3 });
  }, [amount]);

  return (
    <>
      <Flex
        key={assetId}
        justifyContent="space-between"
        alignItems="flex-end"
        py={3}
        px={2}
        mb={2}
        bg="dark.100"
        borderRadius="md"
        h={65}
      >
        <Box>
          <Text fontSize="sm" fontWeight="semibold" color="gray">
            Amount: {assetAmount} {slug}
          </Text>
          <Text fontSize="sm" fontWeight="semibold" color="gray">
            To: {to}
          </Text>
        </Box>
      </Flex>
    </>
  );
}

export { TransactionDetailsItem };
