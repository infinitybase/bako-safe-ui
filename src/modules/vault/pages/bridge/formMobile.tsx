import { Button, Divider, HStack, Icon, VStack } from '@chakra-ui/react';

import { SwapIcon } from '@/components';
import { Asset } from '@/modules/core';

import {
  AmountBrigdeMobile,
  DetailsBridge,
  SendInfoBridgeMobile,
  VaultInfoBridgeMobile,
} from '../../components/bridge';
import { useFormBridge } from '../../hooks/bridge';

interface FormMobilePageBrigdeProps {
  setScreenBridge: React.Dispatch<React.SetStateAction<'form' | 'resume'>>;
  assets?: Required<Asset>[];
}

export function FormMobilePageBrigde({
  assets,
  setScreenBridge,
}: FormMobilePageBrigdeProps) {
  const { isFormComplete } = useFormBridge();
  return (
    <VStack w="585px" height={'100%'} borderRadius="16px" p={4}>
      <VaultInfoBridgeMobile />

      <AmountBrigdeMobile assets={assets} />

      <HStack w="full" align="center" marginY={3}>
        <Divider borderColor="grey.950" h="1px" flex="1" />
        <Icon as={SwapIcon} color="grey.550" fontSize="18px" />
        <Divider borderColor="grey.950" h="1px" flex="1" />
      </HStack>

      <SendInfoBridgeMobile />

      <DetailsBridge />

      <Button
        isDisabled={!isFormComplete}
        variant="primary"
        type="submit"
        fontWeight={600}
        fontSize={14}
        letterSpacing={'2%'}
        w={'full'}
        mt={4}
        onClick={() => setScreenBridge('resume')}
      >
        Continue to resume
      </Button>
    </VStack>
  );
}
