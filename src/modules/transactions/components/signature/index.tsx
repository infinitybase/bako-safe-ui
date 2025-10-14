import { Badge, Loader } from 'bako-ui';

import { PendingIcon } from '@/components';

interface WaitingSignatureBadgeProps {
  isLoading?: boolean;
  quantity: number;
  label?: string;
}

const WaitingSignatureBadge = (props: WaitingSignatureBadgeProps) => {
  const { isLoading, quantity, label = 'Pending Transaction' } = props;

  const has = quantity > 0;

  if (isLoading) {
    return (
      <Loader
        size="lg"
        css={{ '--spinner-track-color': 'dark.100' }}
        colorPalette="brand.500"
      />
    );
  }

  if (!has) {
    return null;
  }

  return (
    <Badge h={5} colorPalette="yellow" variant="outline" fontSize="xs">
      <PendingIcon w="12px" mr={1} />
      {`${quantity} ${label}`}
    </Badge>
  );
};

export { WaitingSignatureBadge };
