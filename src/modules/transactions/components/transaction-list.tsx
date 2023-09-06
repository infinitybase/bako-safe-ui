import { Box } from '@chakra-ui/react';

import { TransactionDetailsItem } from './transaction-details-item';

interface Props {
  assets: {
    name: string;
    slug: string;

    amount: string;
    assetId: string;
    to: string;
  }[];
}

function TransactionList({ assets }: Props) {
  return (
    <Box>
      {assets.map((asset) => (
        <TransactionDetailsItem
          key={asset.assetId}
          name={asset.name}
          slug={asset.slug}
          amount={asset.amount}
          assetId={asset.assetId}
          to={asset.to}
        />
      ))}
    </Box>
  );
}

export { TransactionList };
