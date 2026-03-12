import { Button, HStack, useClipboard, VStack } from 'bako-ui';

import { Dapp } from '@/layouts/dapp';
import { useQueryParams } from '@/modules/auth/hooks';

import { DappCommon, DappSwitchNetwork } from '../components';
import { useSwitchNetworkSocket } from '../hooks/useSwitchNetworkSocket';

const SwitchNetwork = () => {
  const { name, origin } = useQueryParams();

  const {
    vault,
    dapp,
    isLoadingInfo,
    isSwitching,
    infoPage,
    sendNetworkRequest,
  } = useSwitchNetworkSocket();

  const { copy, copied } = useClipboard({ value: vault.address });

  return (
    <Dapp.Container>
      <Dapp.ScrollableContent isLoading={isLoadingInfo}>
        <Dapp.Header
          title="Switch Network"
          description="This app does not support the current connected network. Confirm to switch to the correct one."
        />

        <VStack w="full" gap={0}>
          <DappCommon.VaultCard
            address={vault.address}
            name={vault.name}
            isCurrentAccount
            onCopy={copy}
            hasCopied={copied}
          />

          <DappCommon.OperationArrow label="Current Network" />

          <DappSwitchNetwork.NetworkCard
            icon={<DappSwitchNetwork.FuelLogo />}
            name={infoPage.currentNetworkName}
            url={infoPage.currentNetworkUrl}
          />

          <DappCommon.OperationArrow label="Switching to" />

          <DappSwitchNetwork.NetworkCard
            icon={<DappSwitchNetwork.FuelLogo />}
            name={infoPage.dappNetworkName}
            url={infoPage.dappNetworkUrl}
          />
        </VStack>
      </Dapp.ScrollableContent>

      <Dapp.FixedFooter>
        <DappCommon.RequestingFrom name={name} origin={origin} />

        <HStack gap={6} w="full">
          <Button
            variant="subtle"
            color="gray.300"
            bgColor="gray.600"
            px="20px"
            fontWeight={400}
            onClick={window.close}
          >
            Reject
          </Button>

          <Button
            flex={1}
            colorPalette="primary"
            fontWeight={600}
            loading={isSwitching}
            disabled={isLoadingInfo || isSwitching}
            onClick={() => sendNetworkRequest(dapp)}
          >
            Switch Network
          </Button>
        </HStack>
      </Dapp.FixedFooter>
    </Dapp.Container>
  );
};

export { SwitchNetwork };
