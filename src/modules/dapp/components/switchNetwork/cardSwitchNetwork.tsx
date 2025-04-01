import { Icon, Text, VStack } from '@chakra-ui/react';

import { FuelIcon } from '@/components';
import { BakoIcon } from '@/components/icons/assets/bakoIcon';
import { NetworkType } from '@/modules/network/services';
//import { useNetworks } from '../../hooks';

interface CardSwitchNetworkProps {
  header: string;
  logo: string;
  networkName: string;
  networkUrl: string;
}

const CardSwitchNetwork = ({ ...props }: CardSwitchNetworkProps) => {
  const isMainnet = (url: string) => url?.includes(NetworkType.MAINNET);

  return (
    <VStack
      w="full"
      backgroundColor="#151413"
      gap={7} //{24} // Reduzindo espaço entre elementos
      paddingTop={3}
      paddingBottom={6}
      paddingLeft={3}
      paddingRight={3}
      height={160}
      borderRadius={8}
    >
      <VStack alignItems="flex-start" w={'full'}>
        <Text
          fontSize={12}
          fontWeight={400}
          color="#868079"
          verticalAlign={'middle'}
          lineHeight={'100%'}
          letterSpacing={0}
        >
          {props.header}
        </Text>
      </VStack>

      <VStack gap={2}>
        {/* <Avatar
          color="#AAA6A1"
          boxSize={'46px'}
          bgColor="transparent"
          variant="roundedSquare"
          src={props.logo}
        /> */}
        <Icon
          as={isMainnet(props.networkUrl) ? BakoIcon : FuelIcon}
          fontSize={36}
        />
        <Text
          fontSize={12}
          fontWeight={500}
          color="#F5F5F5"
          lineHeight={'100%'}
          letterSpacing={0}
          verticalAlign={'middle'}
        >
          {props.networkName}
        </Text>

        <Text
          fontSize={12}
          fontWeight={400}
          color="#868079"
          lineHeight={'100%'}
          letterSpacing={0}
        >
          {props.networkUrl}
        </Text>
      </VStack>
    </VStack>
  );
};

export { CardSwitchNetwork };
