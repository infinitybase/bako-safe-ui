import {
  Button,
  Card,
  Divider,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';

import { InformationIcon, MinimalAlertIcon, SwapIcon } from '@/components';

import {
  AlertsBrigde,
  DetailsBridge,
  SectionInfo,
} from '../../components/bridge';

interface ResumePageBrigdeProps {
  setScreenBridge: React.Dispatch<React.SetStateAction<'form' | 'resume'>>;
}

export function ResumePageBrigde({ setScreenBridge }: ResumePageBrigdeProps) {
  return (
    <VStack w="585px" borderRadius="16px" bgColor={'#0D0D0C'} p={4}>
      <VStack w={'full'} flex="start" align="start" gap={4}>
        <Text fontWeight={700} fontSize={16}>
          Resume
        </Text>
        <Text fontWeight={400} fontSize={12} color={'grey.425'}>
          Check your informations before confirming bridge.
        </Text>
      </VStack>
      <SectionInfo direction="From" />
      <HStack w="full" align="center" marginY={3}>
        <Divider borderColor="grey.950" h="1px" flex="1" />
        <Icon as={SwapIcon} color="grey.550" fontSize="18px" />
        <Divider borderColor="grey.950" h="1px" flex="1" />
      </HStack>
      <SectionInfo direction="To" />
      <Card variant="outline" mt={3} padding={3} paddingY={2} w="full">
        <HStack w="full" justifyContent="space-between">
          <Text color="grey.250" fontSize={12}>
            On wallet
          </Text>
          <Text color="grey.50" fontSize={12} fontWeight={500}>
            0xfu...bk14
          </Text>
        </HStack>
      </Card>
      <Divider borderColor="grey.950" h="1px" flex="1" marginY={3} />
      <DetailsBridge bgColor={'#0D0D0C'} padding={0} />

      <AlertsBrigde
        title="Insufficient ETH for gas"
        description="You might not be able to complete the transaction. Reserve 0.00000015121 ETH for gas."
        type={'warning'}
        icon={MinimalAlertIcon}
      />
      <AlertsBrigde
        type={'info'}
        description="Any asset deposited to Fuel can take up 7 days to withdraw back to Ethereum. Learn more about our architecture and security in our docs."
        icon={InformationIcon}
      />
      <HStack w={'full'} gap={4}>
        <Button
          //isDisabled={!hasPermission([OWNER, MANAGER, ADMIN])}
          variant="secondary"
          type="submit"
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
          //isDisabled={!hasPermission([OWNER, MANAGER, ADMIN])}
          variant="primary"
          type="submit"
          fontWeight={600}
          fontSize={14}
          letterSpacing={'2%'}
          w={'full'}
          mt={4}
        >
          Bridge
        </Button>
      </HStack>
    </VStack>
  );
}
