import { HStack, StackProps } from '@chakra-ui/react';
import { bn, Operation } from 'fuels';
import { useMemo } from 'react';

import { AssetBoxInfo } from '../AssetBoxInfo';

interface DeploymentInfoProps extends StackProps {
  operation: Operation;
}

const DeploymentInfo = ({ operation, ...props }: DeploymentInfoProps) => {
  const contractId = operation.to!.address;
  const asset = useMemo(() => {
    const operationCoin = operation.assetsSent![0];
    return {
      ...operationCoin,
      to: contractId,
      amount: bn(operationCoin.amount).format({ precision: 6 }),
    };
  }, [contractId, operation.assetsSent]);

  return (
    <HStack py={2} spacing={{ base: 1, sm: 1 }} {...props}>
      <AssetBoxInfo
        asset={asset}
        borderColor="grey.950"
        borderBottomWidth={1}
        isDeploy
      />
    </HStack>
  );
};

export { DeploymentInfo };
