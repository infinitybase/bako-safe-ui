import { Box, Separator, Heading, Text } from '@chakra-ui/react';

interface TooltipNotEnoughBalanceProps {
  asset?: 'ETH' | 'FUEL';
}

const TooltipNotEnoughBalance = ({
  asset = 'ETH',
}: TooltipNotEnoughBalanceProps) => {
  return (
    <Box
      maxW="260px"
      p={1}
      bg="grey.825"
      py={4}
      px={6}
      borderColor="dark.100"
      borderRadius={4}
    >
      <Heading mb={2} color="grey.75" fontWeight={700} fontSize="xs">
        Not enough balance
      </Heading>
      <Separator borderColor="gray.300" my={4} />
      <Text color="grey.425" fontWeight={400} fontSize="xs" lineHeight="16.8px">
        {asset === 'ETH'
          ? 'Your current ETH balance is insufficient to cover the transaction fees required for this operation. To proceed with the transaction, please add more ETH to your vault.'
          : 'Your current Fuel tokens balance is insufficient to cover any stake.'}
      </Text>
    </Box>
  );
};

export { TooltipNotEnoughBalance };
