import {
  Button,
  Card,
  HStack,
  IconButton,
  Image,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import { LeftAndRightArrow } from '@/components';

import { InputAmount } from '../inputAmount';
import { NetworkOptionItem } from '../selectNewtork';
import { SelectNetworkDrawerBridge } from './selectNetworkDrawer';

const optionsNets = [
  {
    value: 'Network ethereum',
    name: 'Ethereum',
    image: 'https://assets.fuel.network/providers/eth.svg',
    symbol: 'ETH',
  },
  {
    value: 'Network Fuel Ignition',
    name: 'Fuel Ignition',
    image: 'https://verified-assets.fuel.network/images/fuel.svg',
    symbol: 'FUEL',
  },
  {
    value: 'Network Base',
    name: 'Base',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
    symbol: 'BASE',
  },
];

export function AmountBrigdeMobile() {
  const [valueSource, setValueSource] = useState('0.000');
  const [errorAmount, setErrorAmount] = useState(false);
  const [network, setNetwork] = useState<NetworkOptionItem>(optionsNets[0]);
  const selectNetworkDrawer = useDisclosure();

  const handleSourceChange = (value: string) => {
    console.log('value', value);
    setValueSource(value);
  };

  return (
    <Card
      variant="outline"
      padding={3}
      paddingBottom={1}
      w={'full'}
      maxW={{ base: '358px', sm: 'full' }}
      overflow="visible"
      position="relative"
    >
      <SelectNetworkDrawerBridge
        isOpen={selectNetworkDrawer.isOpen}
        onClose={selectNetworkDrawer.onClose}
        selectNetwork={setNetwork}
      />
      <HStack w="full" justifyContent={'space-between'} align="start">
        <Text color="#868079" fontSize={12} fontWeight={400}>
          From
        </Text>
        <VStack justifyContent="flex-end" gap={0} p={1}>
          <HStack w={'full'} align="center" justifyContent="flex-end">
            <Image src={network.image} boxSize={4} />
            <Text color="grey.50" fontSize={12} fontWeight={400}>
              {network.name}
            </Text>
            <IconButton
              icon={<LeftAndRightArrow />}
              variant="unstyled"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="grey.50"
              boxSize="14px"
              minW="10px"
              fontSize={14}
              px={0}
              aria-label="Bridge"
              onClick={() => selectNetworkDrawer.onOpen()}
            />
          </HStack>
          <Text color="#868079" fontSize={12} fontWeight={400}>
            Balance: {'5.458 ' + network.symbol}
          </Text>
        </VStack>
      </HStack>

      <InputAmount
        symbol={network.symbol}
        value={valueSource}
        onChange={handleSourceChange}
        disabled={false} //maxFee === 0 || maxFee == undefined}
      />

      <HStack justifyContent="center">
        <Text color="#868079" fontSize={12} fontWeight={400}>
          {'$ 00,00'}
        </Text>
      </HStack>
      <HStack justifyContent="center" gap={2} align="flex-end" height={'100%'}>
        <Button
          maxH="28px"
          minW="48px"
          isDisabled={false} //maxFee === 0 || maxFee == undefined}
          variant="secondary"
          borderRadius={6}
          padding={'4px 6px 4px 6px'}
          fontSize={10}
          fontWeight={500}
          //onClick={() => handleSetCurrencyAmount(25, balance)}
        >
          <Text color="#868079">MIN</Text>
        </Button>
        <Button
          maxH="28px"
          minW="48px"
          isDisabled={false} //maxFee === 0 || maxFee == undefined}
          variant="secondary"
          onClick={() => {
            setErrorAmount(!errorAmount);
          }} //handleSetCurrencyAmount(50, balance)}
          borderRadius={6}
          padding={'4px 6px 4px 6px'}
          fontSize={10}
          fontWeight={500}
        >
          <Text color="#868079">MAX</Text>
        </Button>
      </HStack>
      <HStack
        h={{
          base: 14,
        }}
      >
        {!!errorAmount && (
          <Text color="red.500" fontSize={10}>
            {/* {errorAmount} */}
            Error na quantidde amount, insuficiente, tente outra coisa!
          </Text>
        )}
      </HStack>
    </Card>
  );
}
