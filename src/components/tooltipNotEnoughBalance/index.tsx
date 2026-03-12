import { Box, Heading, Separator, Text } from 'bako-ui';

interface TooltipNotEnoughBalanceProps {
  asset?: 'ETH' | 'FUEL';
}

const TooltipNotEnoughBalance = ({
  asset = 'ETH',
}: TooltipNotEnoughBalanceProps) => {
  return (
    <Box maxW="260px" p={1} bg="bg.muted" py={4} px={6} borderRadius={4}>
      <Heading mb={2} color="gray.50" fontWeight={700} fontSize="xs">
        Not enough balance
      </Heading>
      <Separator borderColor="gray.300" my={4} />
      <Text color="gray.400" fontWeight={400} fontSize="xs" lineHeight="16.8px">
        {asset === 'ETH'
          ? 'Your current ETH balance is insufficient to cover the transaction fees required for this operation. To proceed with the transaction, please add more ETH to your vault.'
          : 'Your current Fuel tokens balance is insufficient to cover any stake.'}
      </Text>
    </Box>
  );
};

export { TooltipNotEnoughBalance };
