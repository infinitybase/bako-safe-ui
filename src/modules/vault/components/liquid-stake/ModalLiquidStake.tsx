import {
  Card,
  Box,
  Button,
  VStack,
  Text,
  HStack,
  Icon,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';

import {
  CurrencyField,
  Dialog,
  FuelIcon,
  LeftAndRightArrow,
} from '@/components';

const InputField = ({
  symbol,
  autoFocus = false,
}: {
  symbol: string;
  autoFocus?: boolean;
}) => (
  <Box marginY={6} display="flex" justifyContent="center" alignItems="center">
    <InputGroup
      alignItems="center"
      justifyContent="center"
      borderBottom="1px solid"
      borderColor="grey.950"
      _hover={{
        borderColor: 'grey.200',
      }}
      px={0}
      minW="150px"
      w="fit-content"
    >
      <CurrencyField
        width="80%"
        currency="ETH_FUEL"
        textAlign="center"
        borderBottomWidth="0"
        minW={0}
        px={0}
        fontSize="3xl"
        autoFocus={autoFocus}
      />
      <InputRightAddon alignSelf="end" color="section.200">
        {symbol}
      </InputRightAddon>
    </InputGroup>
  </Box>
);

interface ModalLiquidStakeProps {
  isOpen?: boolean;
  onClose: () => void;
}

export function ModalLiquidStake({
  isOpen = false,
  onClose,
}: ModalLiquidStakeProps) {
  return (
    <Dialog.Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <Dialog.Body>
        <Dialog.Header
          position={{ base: 'static', sm: 'relative' }}
          title="Stake to validator"
          mb={0}
          mt={0}
          titleSxProps={{ fontSize: 16, marginTop: { base: 6, md: 0 } }}
          onClose={onClose}
        />
        <VStack marginY={{ base: 10 }}>
          <Card variant="outline" padding={3}>
            <HStack>
              <Text color="#868079" fontSize={12}>
                Stake amount
              </Text>
              <HStack flex={1} justifyContent="flex-end" marginBottom={2}>
                <FuelIcon borderRadius="full" fontSize={16} />
                <Text color="white" fontSize={12}>
                  FUEL
                </Text>
                <Icon as={LeftAndRightArrow} color="grey.75" />
              </HStack>
            </HStack>
            <HStack justifyContent="flex-end">
              <Text color="#868079" fontSize={12}>
                Balance: 114,565.495
              </Text>
            </HStack>
            <InputField symbol="FUEL" autoFocus={true} />
            <HStack justifyContent="center">
              <Button variant="outline">
                <Text color="white">25%</Text>
              </Button>
              <Button variant="outline">
                <Text color="white">50%</Text>
              </Button>
              <Button variant="outline">
                <Text color="white">75%</Text>
              </Button>
              <Button variant="outline">
                <Text color="white">Stake Max</Text>
              </Button>
            </HStack>
          </Card>
          <Card variant="outline" padding={3}>
            <HStack>
              <Text color="#868079" fontSize={12}>
                You receive
              </Text>
              <HStack flex={1} justifyContent="flex-end" marginBottom={2}>
                <FuelIcon borderRadius="full" fontSize={16} />
                <Text color="white" fontSize={12}>
                  stFUEL
                </Text>
              </HStack>
            </HStack>
            <InputField symbol="stFUEL" />
          </Card>
          <Card variant="outline" padding={3}>
            <Text color="#868079" fontSize={12} marginBottom={6}>
              Summary
            </Text>
            <VStack>
              <HStack width="full" marginBottom={1}>
                <Text color="#868079" fontSize={12} flex={1}>
                  Conversion Ratio
                </Text>
                <Text color="#868079" fontSize={12} flex={1} align="right">
                  1 FUEL ~ 0.99985458 WBETH
                </Text>
              </HStack>
              <HStack width="full" marginBottom={1}>
                <Text color="#868079" fontSize={12} flex={1}>
                  Reference APR
                </Text>
                <Text color="#868079" fontSize={12} flex={1} align="right">
                  2.47%
                </Text>
              </HStack>
              <HStack width="full" marginBottom={1}>
                <Text color="#868079" fontSize={12} flex={1}>
                  Max Transaction cost
                </Text>
                <Text color="#868079" fontSize={12} flex={1} align="right">
                  $2.89
                </Text>
              </HStack>
            </VStack>
          </Card>
        </VStack>
        <Dialog.Actions hideDivider={true}>
          <Button variant="primary" width="full">
            Stake
          </Button>
        </Dialog.Actions>
      </Dialog.Body>
    </Dialog.Modal>
  );
}
