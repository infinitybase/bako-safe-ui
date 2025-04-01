import { Box, Button, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { FiArrowUpRight, FiChevronsDown } from 'react-icons/fi';

import { CopyIcon } from '@/components';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

//import { useNetworks } from '../../hooks';
import { CardInfoNetwork, CardSwitchNetwork } from '../components';

const SwitchNetwork = () => {
  //const { handleCloseSwitchNetwork } = useNetworks(props.onClose);
  const hasCopied = false;

  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();

  // const { selectedVaultId } = useAuthSocket();
  // console.log('>>>> selectedVaultId', selectedVaultId);
  // console.log('>>>> userInfos.address', userInfos);
  //const { origin } = useQueryParams();
  const currentNetwork = userInfos?.network?.url
    ? new URL(userInfos.network.url)
    : { hostname: '' };

  console.log('>>> info url', userInfos?.network?.url);

  const networkMainnet = new URL('https://app-mainnet.fuel.network/');
  // vai ser usado mas como nao ta funfando local por causa do env, foi comentado.
  //   const currentNetworkName =
  //   Object.values(availableNetWorks).find(
  //     (n) => n.url === userInfos?.network?.url,
  //   )?.name ?? '';

  // console.log('>>> currentNetworkName', currentNetworkName);
  //   const nameMainNet =
  //     Object.values(availableNetWorks).find(
  //       (n) => n.url === 'https://app-mainnet.fuel.network/',
  //     )?.name ?? '';

  return (
    <VStack
      display="flex"
      minH="$100vh"
      w="full"
      // overflow="hidden"
      // __css={{
      //   '&::-webkit-scrollbar': {
      //     display: 'none',
      //   },
      //   '&::-webkit-scrollbar-thumb': {
      //     display: 'none',
      //   },
      // }}
      backgroundColor="#0D0D0C"
      padding={4}
      gap={3}
    >
      <VStack flex={1}>
        <VStack alignItems="flex-start" gap={3}>
          <Text fontSize={16} fontWeight={700} color="#F5F5F5">
            {'Switch Network'}
          </Text>
          <Text fontSize={12} fontWeight={400} color="#868079">
            {
              'This app does not support the current connected network. Confirm to switch to correct one.'
            }
          </Text>
          /
        </VStack>
        <VStack w="full" gap={2}>
          <CardInfoNetwork
            header="Vault:"
            title={'Personal Vault'}
            operation={'sdhAUHAU'}
            icon={CopyIcon}
            colorIcon={hasCopied ? 'success.700' : '#868079'}
            avataBgColor="#353230"
          />

          <CardInfoNetwork
            header="Requesting to Switch Network from:"
            title={'Provide Liquidity on MIRA AMM | Ear...'}
            operation="mira.ly"
            icon={FiArrowUpRight}
            colorIcon={'#868079'}
            avataBgColor="transparent"
            avatarUrl="https://s3-alpha-sig.figma.com/img/7d57/6a0c/6dde45cd053d1552598df8b1a096e5de?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=nBwo-yU8UoP255Du4ANO2slYSLmQw37N5VrZn~0RN8Q4TP~acXGABEJBCKyLacVviXnHU~QiTxBv75GmmVM6TcPcXTE8uMSol-f7BDcL2-sKojWN0M~Tf4DHOs13aHbNnjHf894xUIOk3JqT-6oxiWcMmYv62HOC~i6nPoyt1h3UK6TYgforCZJ3IqV4gNEBkTQ9Y9tcUoYuTIK4JzIPGrXFKolipDBPc1v0ecgGGayr07X8niIaXGYWFQTe4wVqcqkCvTVjo-92tzyW60uKw2SDqBEZ80Ms0Fd0dj1Q1tIrIPb4JgzIe7pjVvuPYE7qPZxE6GLGZmInwqwLUEDH-g__"
          />
        </VStack>

        <VStack w="full">
          <CardSwitchNetwork
            header="Current Network:"
            logo={
              'https://s3-alpha-sig.figma.com/img/c0eb/c9a6/a317997f411f6ef3a746b9929dec306b?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IqHsBmgVqwtTvV7Qw-UsB3cME4OGuzFwIvLgkuNttLSnTpygtuZmpQV2Guz5NPX9SmQMCqXiNAam6cX-UEeVbNsbOK3ZknajvJoe57N9X3oyrJnT6WZ2gk-djsKxENfcj4QiVFg7EKlyquxhsRpudCGlh75kypupQu73IBuqEhmBzqtRuB9h4nWRjOrJN7T30C1Ix06vfArnWfMVQJgevRbZyH884vkEFx13AeG9~kEFt6s9mljGbBhkt-2m~CpV~~Cf3fsUFoEGec9~KZu2RZ~mWSaIGEIdvAK5L7ehxoQleVU3e86GqklWQMWVM~2LmP~8~ozAKdE2W0SlMDIYOQ__'
            }
            networkName={'Test net'} //currentNetworkName}
            networkUrl={currentNetwork.hostname}
          />

          <Box
            w="full"
            display={'flex'}
            backgroundColor="#151413"
            padding={3}
            borderRadius={6}
            height={8}
            alignItems={'center'}
            justifyContent="center"
          >
            <Icon as={FiChevronsDown} color={'#AAA6A1'} fontSize="2xl" />
          </Box>

          <CardSwitchNetwork
            header="Switching to:"
            logo={''}
            networkName={'Ignition'} //nameMainNet}
            networkUrl={networkMainnet.hostname}
          />
        </VStack>
      </VStack>

      <HStack
        w="full"
        gap={4}
        justifyContent={'center'}
        alignItems={'center'}
        verticalAlign={'center'}
      >
        <Button
          variant="primary"
          fontWeight={500}
          color={'#CFCCC9'}
          bgColor={'#0D0D0C'}
          border={'1px solid #CFCCC9'}
          //lineHeight={1.5}
          letterSpacing={'2%'}
          borderRadius={8}
          flex="1"
          //onClick={onOpen}
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
          //onClick={onOpen}
        >
          Switch network
        </Button>
      </HStack>
    </VStack>
  );
};

export { SwitchNetwork };
