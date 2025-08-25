import { Button, Divider, HStack, Icon, VStack } from '@chakra-ui/react';

import { SwapIcon } from '@/components';

import {
  AmountBrigdeMobile,
  DetailsBridge,
  SendInfoBridgeMobile,
  VaultInfoBridgeMobile,
} from '../../components/bridge';

interface FormMobilePageBrigdeProps {
  setScreenBridge: React.Dispatch<React.SetStateAction<'form' | 'resume'>>;
}

export function FormMobilePageBrigde({
  setScreenBridge,
}: FormMobilePageBrigdeProps) {
  return (
    <VStack w="585px" height={'100%'} borderRadius="16px" p={4}>
      <VaultInfoBridgeMobile />

      <AmountBrigdeMobile />

      <HStack w="full" align="center" marginY={3}>
        <Divider borderColor="grey.950" h="1px" flex="1" />
        <Icon as={SwapIcon} color="grey.550" fontSize="18px" />
        <Divider borderColor="grey.950" h="1px" flex="1" />
      </HStack>

      <SendInfoBridgeMobile />

      <DetailsBridge />

      <Button
        //isDisabled={!hasPermission([OWNER, MANAGER, ADMIN])}
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
