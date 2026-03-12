import { Box, Flex, Text } from 'bako-ui';
import { bn } from 'fuels';
import { useMemo } from 'react';

interface Props {
  name: string;
  slug: string;
  amount: string;
  assetId: string;
}

function AssetItem({ assetId, name, amount, slug }: Props) {
  const assetAmount = useMemo(() => {
    return bn(bn.parseUnits(amount.toString()))?.format({ precision: 3 });
  }, [amount]);

  return (
    <Flex
      key={assetId}
      justifyContent="space-between"
      alignItems="center"
      py={2}
      px={3}
      mb={2}
      bg="dark.100"
      borderRadius="md"
      h={65}
    >
      <Box>
        <Text fontSize="sm" color="white">
          {name}
        </Text>
        <Text fontSize="sm" fontWeight="semibold" color="gray">
          {slug}
        </Text>
      </Box>

      <Box fontWeight="semibold" fontSize="sm" color="gray">
        {assetAmount} {slug}
      </Box>
    </Flex>
  );
}

export { AssetItem };
