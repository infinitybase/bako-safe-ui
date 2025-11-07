import { Flex, Tabs, Tooltip } from 'bako-ui';
import { useSearchParams } from 'react-router-dom';

import { Container } from '../../components/buy-sell';
import { BuyTabPanel } from '../../components/buy-sell/BuyTabPanel';
import { SellTabPanel } from '../../components/buy-sell/SellTabPanel';
import { useVaultInfosContext } from '../../hooks';

export const VaultBuySellPage = () => {
  const [params, setSearchParams] = useSearchParams();
  const { vault } = useVaultInfosContext();

  const currentTab = params.get('type') || 'buy';

  const handleTabChange = (i: number) => {
    const tab = i === 0 ? 'buy' : 'sell';
    setSearchParams({ type: tab });
  };

  return (
    <Flex w="full" direction="column" flex={1}>
      <Container>
        <Tabs.Root
          value={currentTab}
          onValueChange={(e) => handleTabChange(Number(e.value))}
          lazyMount
        >
          <Tabs.List>
            <Tabs.Trigger value="buy" w="full">
              Buy
            </Tabs.Trigger>
            <Tabs.Trigger value="sell" w="full" disabled>
              <Tooltip content="Coming soon">Sell</Tooltip>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="buy">
            <BuyTabPanel vault={vault.data} isLoading={vault.isLoading} />
          </Tabs.Content>
          <Tabs.Content value="sell">
            <SellTabPanel vault={vault.data} isLoading={vault.isLoading} />
          </Tabs.Content>
        </Tabs.Root>
      </Container>
    </Flex>
  );
};
