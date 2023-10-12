import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';

import { Card } from '@/components';
import { AddressCopy } from '@/components/addressCopy';

import { UseVaultDetailsReturn } from '../hooks/details';
import { SignersDetails } from './SignersDetails';

export interface CardDetailsProps {
  store: UseVaultDetailsReturn['store'];
  vault: UseVaultDetailsReturn['vault'];
}

const SettingsOverview = (props: CardDetailsProps) => {
  const { vault } = props;
  // const { biggerAsset, visebleBalance, setVisibleBalance } = store;

  if (!vault) return;

  return (
    <Box w="full">
      <Box mb={5} w="full">
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Vault Overview
        </Text>
      </Box>

      <Skeleton
        hidden={!vault.isLoading}
        w="full"
        h={340}
        startColor="dark.100"
        endColor="dark.300"
        borderRadius={10}
      />

      <Card hidden={vault.isLoading} p={8} bg="dark.200" borderColor="dark.100">
        <HStack>
          <VStack spacing={9} w="full">
            <HStack spacing={6} w="full">
              <Center>
                <Avatar
                  variant="roundedSquare"
                  name={vault.name}
                  bg="grey.900"
                  size={'lg'}
                  p={10}
                />
              </Center>
              <Box>
                <Heading mb={1} variant="title-xl">
                  {vault?.name}
                </Heading>

                <Box maxW={420}>
                  <Text variant="description">
                    Setting Sail on a Journey to Unlock the Potential of
                    User-Centered Design.
                  </Text>
                </Box>
                {/* <Text variant="description">{vault?.description}</Text> */}
              </Box>
            </HStack>

            <HStack
              w="full"
              spacing={5}
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <VStack spacing={5}>
                <Box width="100%">
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Text variant="description">Vault balance</Text>
                    <Heading variant="title-xl">
                      {/* {`${biggerAsset?.amount} ${biggerAsset?.slug}`} */}
                      {`532.0545429 ETH`}
                    </Heading>
                  </HStack>
                </Box>

                <Divider />

                <HStack spacing={40}>
                  <VStack spacing={2} alignItems="flex-start">
                    <Button minW={130} variant="primary">
                      Deposit
                    </Button>
                    <Text variant="description" fontSize="xs">
                      Add assets to the vault. <br /> Choose the asset you
                      prefer.
                    </Text>
                  </VStack>

                  <VStack spacing={2} alignItems="flex-start">
                    <Button minW={130} variant="primary">
                      Send
                    </Button>
                    <Text variant="description" fontSize="xs">
                      Send single or batch <br /> payments with multi assets.
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </HStack>
          </VStack>

          <VStack spacing={4} justifyContent="flex-start">
            <Box p={3} backgroundColor={'white'} borderRadius={10}>
              <QRCodeSVG
                value={vault.predicateAddress!}
                fgColor="black"
                bgColor="white"
                style={{
                  borderRadius: 10,
                  width: 180,
                  height: 180,
                }}
              />
            </Box>

            <AddressCopy
              w="full"
              address="fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8"
              // address={vault.predicateAddress!}
            />
          </VStack>
        </HStack>
      </Card>

      <Box mt={8}>
        <SignersDetails vault={vault} />
      </Box>
    </Box>
  );
};

export { SettingsOverview };
