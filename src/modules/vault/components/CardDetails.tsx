import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import React from 'react';

import { Card } from '@/components';

import { AddressCopy } from '../../../components/addressCopy';
import { UseVaultDetailsReturn } from '../hooks/details';

export interface CardDetailsProps {
  store: UseVaultDetailsReturn['store'];
  vault: UseVaultDetailsReturn['vault'];
}

const CardDetails = (props: CardDetailsProps) => {
  const { store, vault } = props;
  const { biggerAsset, visebleBalance, setVisibleBalance } = store;

  if (!vault) return;

  return (
    <Box w="full" maxW="465px">
      <Box mb={5} w="full">
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Overview
        </Text>
      </Box>
      <Card>
        <VStack spacing={9} w="full">
          <HStack spacing={6} w="full">
            <Center>
              <Avatar
                size="xxl"
                bgColor="dark.100"
                color="white"
                name={vault.name}
              />
            </Center>
            <Box>
              <Heading mb={3} variant="title-xl">
                {vault?.name}
              </Heading>

              <Text variant="description">{vault?.description}</Text>
            </Box>
          </HStack>

          <HStack
            spacing={5}
            justifyContent="flex-start"
            alignItems="flex-start"
          >
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
              <AddressCopy w="full" address={vault.predicateAddress!} />
            </VStack>
            <VStack spacing={5}>
              <Box width="100%">
                <HStack width="100%" spacing={2}>
                  <HStack spacing={2}>
                    <Heading variant="title-xl">
                      {visebleBalance ? '*****' : biggerAsset?.amount}
                    </Heading>
                    <Text variant="description" fontSize="md">
                      {!visebleBalance && biggerAsset?.slug}
                    </Text>
                  </HStack>
                  <Box
                    display="flex"
                    width="18%"
                    justifyContent="center"
                    alignItems="center"
                    onClick={() => setVisibleBalance(!visebleBalance)}
                  >
                    {visebleBalance ? (
                      <ViewIcon boxSize={6} />
                    ) : (
                      <ViewOffIcon boxSize={6} />
                    )}
                  </Box>
                </HStack>
                <Text variant="description">Vault balance</Text>
              </Box>
              <VStack spacing={2} alignItems="flex-start">
                <Button minW={130} variant="primary">
                  Deposit
                </Button>
                <Text variant="description" fontSize="xs">
                  Add assets to the vault. Choose the asset you prefer.
                </Text>
              </VStack>
              <VStack spacing={2} alignItems="flex-start">
                <Button minW={130} variant="primary">
                  Send
                </Button>
                <Text variant="description" fontSize="xs">
                  Send single or batch payments with multi assets.
                </Text>
              </VStack>
            </VStack>
          </HStack>
        </VStack>
      </Card>
    </Box>
  );
};

export { CardDetails };
