import { HStack, HStackProps, Image, Text, VStack } from 'bako-ui';
import { memo } from 'react';

import RigContractIcon from '@/assets/images/rig-icon.png';
import { LayerSwapIcon } from '@/components';
import { miraData } from '@/config/swap';
import { Nullable } from '@/modules/core';

const FromIconComponent = ({ origin }: { origin: Nullable<string> }) => {
  if (origin === miraData.origin)
    return <Image src={miraData.icon} boxSize="36px" rounded="sm" />;

  if (origin === 'https://rig.st')
    return <Image src={RigContractIcon} boxSize="36px" rounded="sm" />;

  if (origin === 'https://layerswap.io')
    return <LayerSwapIcon boxSize="36px" rounded="sm" />;

  return null;
};

const FromIcon = memo(FromIconComponent);

interface DappRequestingFromProps extends HStackProps {
  name: Nullable<string>;
  origin: Nullable<string>;
}

const DappRequestingFrom = (props: DappRequestingFromProps) => {
  const { name, origin, ...rest } = props;

  return (
    <HStack
      gap={3}
      align="center"
      bg="gray.550"
      borderRadius="8px"
      p={3}
      w="full"
      {...rest}
    >
      <FromIcon origin={origin} />
      <VStack gap={2} align="flex-start">
        <Text color="gray.100" fontSize={12} fontWeight={500} lineHeight="9px">
          {name}
        </Text>
        <Text color="gray.300" fontSize={12} fontWeight={400} lineHeight="9px">
          Requesting a transaction from: {origin?.split('//')[1]}
        </Text>
      </VStack>
    </HStack>
  );
};

export { DappRequestingFrom };
