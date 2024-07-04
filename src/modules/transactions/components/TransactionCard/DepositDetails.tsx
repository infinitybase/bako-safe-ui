import { Box, Text } from '@chakra-ui/react';
import { TransactionUI } from './Details';
import DetailItem from './deposit-details/DetailItem';

type DepositDetailsProps = {
  transaction: TransactionUI;
};

const DepositDetails = ({ transaction }: DepositDetailsProps) => {
  return (
    <Box
      display="flex"
      flexDirection={{ base: 'row', xs: 'column' }}
      w="full"
      minW={{ base: 200, sm: '476px' }}
      flexWrap="wrap"
    >
      <Box pb={3} borderColor="grey.950" borderBottomWidth={1}>
        <Text color="grey.425" fontSize="sm">
          Transaction breakdown
        </Text>
      </Box>

      <Box
        alignItems="flex-start"
        flexWrap="wrap"
        py={3}
        borderColor="grey.950"
        borderBottomWidth={1}
      >
        {transaction.assets.map((asset, index) => (
          <DetailItem key={index} asset={asset} />
        ))}
      </Box>
    </Box>
  );
};
export { DepositDetails };
