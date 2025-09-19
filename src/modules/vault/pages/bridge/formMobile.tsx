import { Button, Divider, HStack, Icon, VStack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

import { SwapIcon } from '@/components';

import {
  AmountBrigdeMobile,
  DetailsBridge,
  SendInfoBridgeMobile,
  VaultInfoBridgeMobile,
} from '../../components/bridge';
import { TitleButtonsForm } from '../../components/bridge/utils';
import { UseVaultDetailsReturn } from '../../hooks';
import { useFormBridge } from '../../hooks/bridge';

interface FormMobilePageBrigdeProps {
  setScreenBridge: React.Dispatch<React.SetStateAction<'form' | 'resume'>>;
  assets?: UseVaultDetailsReturn['assets'];
}

export function FormMobilePageBrigde({
  assets,
  setScreenBridge,
}: FormMobilePageBrigdeProps) {
  const { isFormComplete, errorForm, isPendingSigner } = useFormBridge();
  const [errorAmount, setErrorAmount] = useState<string | null>(null);

  const notEnoughBalanceETH = useMemo(() => {
    return assets?.isEthBalanceLowerThanReservedAmount;
  }, [assets]);

  return (
    <VStack w="585px" height={'100%'} borderRadius="16px" p={4}>
      <VaultInfoBridgeMobile />

      <AmountBrigdeMobile
        assets={assets?.assets}
        errorAmount={errorAmount}
        setErrorAmount={setErrorAmount}
      />

      <HStack w="full" align="center" marginY={3}>
        <Divider borderColor="grey.950" h="1px" flex="1" />
        <Icon as={SwapIcon} color="grey.550" fontSize="18px" />
        <Divider borderColor="grey.950" h="1px" flex="1" />
      </HStack>

      <SendInfoBridgeMobile
        errorAmount={errorAmount}
        setErrorAmount={setErrorAmount}
      />

      <DetailsBridge />

      <Button
        isDisabled={
          !isFormComplete ||
          !!errorAmount ||
          !!errorForm ||
          isPendingSigner ||
          notEnoughBalanceETH
        }
        variant="primary"
        type="submit"
        fontWeight={600}
        fontSize={14}
        letterSpacing={'2%'}
        w={'full'}
        mt={4}
        onClick={() => setScreenBridge('resume')}
      >
        {isPendingSigner
          ? TitleButtonsForm.PENDING_TX
          : notEnoughBalanceETH
            ? TitleButtonsForm.INSUFFICIENT_ETH
            : TitleButtonsForm.CONTINUE}
      </Button>
    </VStack>
  );
}
