import { Text, VStack } from 'bako-ui';

import { FuelLogo } from './logoFuel';

interface CardSwitchNetworkProps {
  header: string;
  networkName: string;
  networkUrl: string;
}

const CardSwitchNetwork = ({ ...props }: CardSwitchNetworkProps) => {
  return (
    <VStack
      w="full"
      backgroundColor="dark.950"
      gap={7}
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
          color="grey.425"
          verticalAlign={'middle'}
          lineHeight={'100%'}
          letterSpacing={0}
        >
          {props.header}
        </Text>
      </VStack>

      <VStack gap={2}>
        <FuelLogo />

        <Text
          fontSize={12}
          fontWeight={500}
          color="grey.50"
          lineHeight={'100%'}
          letterSpacing={0}
          verticalAlign={'middle'}
        >
          {props.networkName}
        </Text>

        <Text
          fontSize={12}
          fontWeight={400}
          color="grey.425"
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
