import { Text } from '@chakra-ui/react';
import React from 'react';

import { Card } from '@/components';

export interface FeeProps {
  fee?: string;
  isLoading?: boolean;
}

const DappTransactionFee = ({ fee, isLoading }: FeeProps) =>
  isLoading || !fee ? null : (
    <Card display="flex" justifyContent="space-between">
      <Text variant="subtitle">Gas Fee (ETH)</Text>
      <Text variant="subtitle">{fee}</Text>
    </Card>
  );

export { DappTransactionFee };
