import { Stack } from 'bako-ui';

import { useCreateWidget, useListOnRampPurchaseLimits } from '../../hooks';
import { BuyOrSellForm } from './BuyOrSellForm';
import { PanelSkeleton } from './PanelSkeleton';
import { VaultInfo } from './VaultInfo';

interface BuyTabPanelProps {
  vault: {
    name: string;
    predicateAddress: string;
  };
  isLoading: boolean;
}

export const BuyTabPanel = ({ vault, isLoading }: BuyTabPanelProps) => {
  const { createWidgetAsync, isPending } = useCreateWidget();
  const { purchaseLimits, isLoading: isLoadingPurchaseLimits } =
    useListOnRampPurchaseLimits();

  if (isLoading || isLoadingPurchaseLimits) {
    return <PanelSkeleton />;
  }

  return (
    <Stack gap={2}>
      <VaultInfo name={vault.name} address={vault.predicateAddress} />

      <BuyOrSellForm
        onSubmit={createWidgetAsync}
        vaultAddress={vault.predicateAddress}
        purchaseLimits={purchaseLimits}
        isSubmitting={isPending}
        type="BUY"
      />
    </Stack>
  );
};
