import { Box, Divider, Heading, Text } from '@chakra-ui/react';

const TooltipNotEnoughBalance = () => {
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
      <Divider borderColor="gray.300" my={4} />
      <Text color="grey.425" fontWeight={400} fontSize="xs" lineHeight="16.8px">
        Your current ETH balance is insufficient to cover the transaction fees
        required for this operation. To proceed with the transaction, please add
        more ETH to your vault.
      </Text>
    </Box>
  );
};

export { TooltipNotEnoughBalance };
