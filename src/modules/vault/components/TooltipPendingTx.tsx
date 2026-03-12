import { Box, Heading } from 'bako-ui';

export const TooltipPendingTx = () => {
  return (
    <Box bg="bg.muted" p={2} borderRadius="lg">
      <Heading fontSize="xs" color="gray.50">
        This account has pending transactions.
      </Heading>
    </Box>
  );
};
