import { Button, Card, HStack, Icon, Separator, Text, VStack } from 'bako-ui';
import { bn } from 'fuels';
import { useCallback, useMemo } from 'react';

import { MinimalAlertIcon, SwapIcon } from '@/components';
import { AddressUtils, Asset } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import {
  AlertsBrigde,
  DetailsBridge,
  SectionInfo,
} from '../../components/bridge';
import { TitleButtonsForm } from '../../components/bridge/utils';
import { useFormBridge } from '../../hooks/bridge';

interface ResumePageBrigdeProps {
  assets?: Required<Asset>[];
  setScreenBridge: React.Dispatch<React.SetStateAction<'form' | 'resume'>>;
}

export function ResumePageBrigde({
  assets,
  setScreenBridge,
}: ResumePageBrigdeProps) {
  const {
    assetFrom,
    assetTo,
    networkTo,
    destinationAddress,
    amount,
    assetFromUSD,
    isSendingTx,
    dataQuote,
    isPendingSigner,
    onSubmit,
  } = useFormBridge();

  const { assetsMap } = useWorkspaceContext();

  const balance = useMemo(() => {
    const asset = assets?.find((a) => a.assetId === assetFrom?.value);
    if (!asset?.amount) return '0';

    const assetsInfo = assetsMap?.[asset.assetId] ?? assetsMap?.['UNKNOWN'];

    return bn(asset.amount)?.format({
      units: assetsInfo?.units ?? assetsMap.UNKNOWN.units,
    });
  }, [assets, assetFrom?.value, assetsMap]);

  const checkEnoughETH = useCallback(() => {
    const fee = dataQuote?.quote?.totalFee * 2;
    if (!fee) return true;

    const maxAmount = Number(balance) - fee;

    return maxAmount > Number(amount);
  }, [balance, amount, dataQuote?.quote?.totalFee]);

  const feeReserved = useMemo(() => {
    const fee = dataQuote?.quote?.totalFee * 2;
    if (!fee) return 0;
    return fee;
  }, [dataQuote?.quote?.totalFee]);

  return (
    <VStack
      w="585px"
      borderRadius="16px"
      bgColor={'dark.850'}
      p={4}
      as="form"
      onSubmit={onSubmit}
    >
      <VStack w={'full'} flex="start" align="start" gap={4}>
        <Text fontWeight={700} fontSize={16}>
          Resume
        </Text>
        <Text fontWeight={400} fontSize={12} color={'grey.425'}>
          Check your informations before confirming bridge.
        </Text>
      </VStack>
      <SectionInfo
        direction="From"
        asset={assetFrom}
        network={'Fuel ignition'}
        imageNetwork={'https://verified-assets.fuel.network/images/fuel.svg'}
        amount={amount}
        amountUSD={assetFromUSD}
      />
      <HStack w="full" align="center" marginY={3}>
        <Separator borderColor="grey.950" h="1px" flex="1" />
        <Icon as={SwapIcon} color="grey.550" fontSize="18px" />
        <Separator borderColor="grey.950" h="1px" flex="1" />
      </HStack>
      <SectionInfo
        direction="To"
        asset={assetTo}
        network={networkTo?.name ?? ''}
        imageNetwork={networkTo?.image ?? ''}
        amount={
          dataQuote?.quote?.receiveAmount ? dataQuote?.quote?.receiveAmount : ''
        }
        amountUSD={
          dataQuote?.receiveInUsd ? `(${dataQuote?.receiveInUsd})` : '-'
        }
      />
      <Card.Root variant="subtle" mt={3} padding={3} paddingY={2} w="full">
        <HStack w="full" justifyContent="space-between">
          <Text color="grey.250" fontSize={12}>
            On wallet
          </Text>
          <Text color="grey.50" fontSize={12} fontWeight={500}>
            {AddressUtils.format(destinationAddress ?? '', 6)}
          </Text>
        </HStack>
      </Card.Root>
      <Separator borderColor="grey.950" h="1px" flex="1" marginY={3} />
      <DetailsBridge />

      {!checkEnoughETH() && (
        <AlertsBrigde
          type={'warning'}
          title={'Insufficient ETH for gas'}
          description={`You might not be able to complete the transaction. Reserve ${feeReserved} ETH for gas`}
          icon={MinimalAlertIcon}
        />
      )}

      <HStack w={'full'} gap={4}>
        <Button
          colorPalette="secondary"
          fontWeight={500}
          fontSize={14}
          letterSpacing={'2%'}
          w={'full'}
          mt={4}
          onClick={() => setScreenBridge('form')}
        >
          Return
        </Button>

        <Button
          disabled={isSendingTx || isPendingSigner || !checkEnoughETH()}
          loading={isSendingTx}
          colorPalette="primary"
          type="submit"
          fontWeight={600}
          fontSize={14}
          letterSpacing={'2%'}
          w={'full'}
          mt={4}
        >
          {isPendingSigner
            ? TitleButtonsForm.PENDING_TX
            : TitleButtonsForm.BRIDGE}
        </Button>
      </HStack>
    </VStack>
  );
}
