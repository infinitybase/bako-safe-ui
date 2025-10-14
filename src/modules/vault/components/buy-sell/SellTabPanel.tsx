import { Stack } from 'bako-ui';

import { useCreateWidget, useListOffRampPurchaseLimits } from '../../hooks';
import { BuyOrSellForm } from './BuyOrSellForm';
import { PanelSkeleton } from './PanelSkeleton';
import { VaultInfo } from './VaultInfo';

interface SellTabPanelProps {
  vault: {
    name: string;
    predicateAddress: string;
  };
  isLoading: boolean;
}

export const SellTabPanel = ({ vault, isLoading }: SellTabPanelProps) => {
  const { createWidgetAsync, isPending } = useCreateWidget();
  const { purchaseLimits, isLoading: isLoadingPurchaseLimits } =
    useListOffRampPurchaseLimits();

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
        type="SELL"
      />
    </Stack>
  );
};
