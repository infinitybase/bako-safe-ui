import { HStack, HStackProps, Image, Skeleton, Text } from 'bako-ui';
import { useState } from 'react';

import { useScreenSize } from '@/modules/core/hooks/useScreenSize';

export interface AssetItem {
  value: string;
  image?: string;
  name: string;
  symbol: string | null;
  balance?: string;
}

export interface ItemProps extends Omit<HStackProps, 'onSelect' | 'onClick'> {
  asset: AssetItem;
  onSelect?: (asset: AssetItem) => void;
}

export const Item = ({ asset, onSelect, ...props }: ItemProps) => {
  const { image, name, symbol, balance } = asset;

  const [loaded, setLoaded] = useState(false);

  const { isExtraSmall } = useScreenSize();

  return (
    <HStack
      as="li"
      border="1px solid"
      borderColor="gray.500"
      gap={3}
      padding={3}
      borderRadius={8}
      cursor="pointer"
      _hover={{ bgColor: 'bg.muted/90' }}
      w="100%"
      onClick={() => onSelect?.(asset)}
      {...props}
    >
      <Skeleton
        loading={!loaded}
        boxSize={6}
        borderRadius="full"
        flexShrink={0}
      >
        <Image
          src={image}
          alt={name}
          boxSize={6}
          borderRadius="full"
          flexShrink={0}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      </Skeleton>
      <Text
        fontSize="xs"
        fontWeight="medium"
        color="gray.50"
        lineHeight="100%"
        truncate
      >
        {name}
      </Text>
      {balance && symbol && !isExtraSmall && (
        <Text
          ml="auto"
          fontSize="xs"
          color="gray.50"
          lineHeight="100%"
          whiteSpace="nowrap"
        >
          {balance} {symbol}
        </Text>
      )}
    </HStack>
  );
};
