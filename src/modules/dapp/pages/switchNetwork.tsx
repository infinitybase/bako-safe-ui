import { Box, Button, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { FiArrowUpRight, FiChevronsDown } from 'react-icons/fi';

import { BakoLoading, CopyIcon } from '@/components';

import { CardInfoNetwork, CardSwitchNetwork } from '../components';
import { useSwitchNetworkSocket } from '../hooks/useSwitchNetworkSocket';

const SwitchNetwork = () => {
  const {
    vault,
    dapp,
    isLoadingInfo,
    isSwitching,
    infoPage,
    redirectToDapp,
    sendNetworkRequest,
  } = useSwitchNetworkSocket();

  if (isLoadingInfo) {
    return <BakoLoading />;
  }

  return (
    <VStack w="full" backgroundColor="dark.850" padding={6} h="$100vh">
      <Box
        w="full"
        display="flex"
        justifyContent="center"
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': { width: '0' },
          scrollbarWidth: 'none',
        }}
      >
        <VStack maxWidth={404} w="full" gap={6} pb={6}>
          <VStack alignItems="flex-start" gap={3}>
            <Text fontSize={16} fontWeight={700} color="grey.50">
              {'Switch Network'}
            </Text>
            <Text fontSize={12} fontWeight={400} color="grey.425">
              {
                'This app does not support the current connected network. Confirm to switch to correct one.'
              }
            </Text>
            /
          </VStack>
          <VStack w="full" gap={2}>
            <CardInfoNetwork
              header="Vault:"
              title={vault.name}
              operation={vault.address}
              opIsAddress
              icon={CopyIcon}
              colorIcon={'grey.425'}
              avataBgColor="grey.950"
            />

            <CardInfoNetwork
              header="Requesting to Switch Network from:"
              title={dapp.name}
              operation={infoPage.dappOrigin}
              icon={FiArrowUpRight}
              colorIcon={'grey.425'}
              avataBgColor="grey.950"
              onClick={() => redirectToDapp(dapp.origin)}
            />
          </VStack>

          <VStack w="full" gap={1}>
            <CardSwitchNetwork
              header="Current Network:"
              networkName={infoPage.currentNetworkName}
              networkUrl={infoPage.currentNetworkUrl}
            />

            <Box
              w="full"
              display={'flex'}
              backgroundColor="dark.950"
              padding={3}
              borderRadius={6}
              height={7}
              alignItems={'center'}
              justifyContent="center"
            >
              <Icon as={FiChevronsDown} color={'grey.250'} fontSize="2xl" />
            </Box>

            <CardSwitchNetwork
              header="Switching to:"
              networkName={infoPage.dappNetworkName}
              networkUrl={infoPage.dappNetworkUrl}
            />
          </VStack>
        </VStack>
      </Box>

      <HStack
        w="full"
        gap={4}
        justifyContent={'center'}
        alignItems={'center'}
        maxWidth={404}
        paddingY={6}
        bgColor={'dark.850'}
      >
        <Button
          variant="primary"
          fontWeight={500}
          color={'grey.75'}
          bgColor={'dark.850'}
          border={'1px solid'}
          borderColor={'grey.75'}
          letterSpacing={'2%'}
          borderRadius={8}
          flex="1"
          onClick={() => window.close()}
        >
          Reject
        </Button>

        <Button
          variant="primary"
          fontWeight={600}
          borderRadius={8}
          flex="1"
          lineHeight={'100%'}
          letterSpacing={'2%'}
          isLoading={isSwitching}
          onClick={() => sendNetworkRequest(dapp)}
        >
          Switch network
        </Button>
      </HStack>
    </VStack>
  );
};

export { SwitchNetwork };
