import { Box, Heading } from '@chakra-ui/react';

export const TooltipPendingTx = () => {
  return (
    <Box bg="grey.825" p={2} borderColor="dark.100" borderRadius={4}>
      <Heading fontSize="xs" color="grey.75">
        This vault has pending transactions.
      </Heading>
    </Box>
  );
};
