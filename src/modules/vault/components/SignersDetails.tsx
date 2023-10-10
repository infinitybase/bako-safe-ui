import { Badge, Box, HStack, Image, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import { Card } from '@/components';

import { AddressUtils } from '../../core/utils/address';
import { UseVaultDetailsReturn } from '../hooks/details';

export interface SignersDetailsProps {
  vault: UseVaultDetailsReturn['vault'];
}

const SignersDetails = (props: SignersDetailsProps) => {
  const { vault } = props;
  const formatList = (list: { address: string; isOwner: boolean }[]) => {
    return list.length - 4;
  };

  const isBig = formatList(vault?.signers || []);

  if (!vault) return null;

  return (
    <Box w="full">
      <HStack alignItems="flex-start" mb={5} w="full" spacing={2}>
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Signers
        </Text>
        <Badge p={1} variant="warning">
          Required signers {vault?.minSigners}/{vault?.signers.length}
        </Badge>
      </HStack>
      <VStack>
        {vault.signers.map(
          (asset: { address: string; isOwner: boolean }, index: number) => {
            if (isBig > 0 && index > 3) return;
            if (isBig > 0 && index == 3) {
              return (
                <Card
                  key={index}
                  w="full"
                  p={2}
                  display="flex"
                  alignItems="center"
                  borderStyle="dashed"
                >
                  <HStack
                    w="100%"
                    spacing={0}
                    justifyContent="center"
                    alignItems="center"
                    display="flex"
                    flexDirection="column"
                    cursor="pointer"
                  >
                    <Text
                      variant="description"
                      fontSize="20px"
                      fontWeight="bold"
                    >
                      +{isBig + 1}
                    </Text>
                    <Text variant="description" fontSize="15px">
                      View all
                    </Text>
                  </HStack>
                </Card>
              );
            }
            return (
              <Card
                key={index}
                w="full"
                h="85"
                p={2}
                display="flex"
                alignItems="center"
                mb={2}
              >
                <HStack w="30%" justifyContent="center">
                  <Image
                    borderRadius={10}
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg"
                    boxSize={12}
                  />
                </HStack>
                <HStack w="70%" display="flex" justifyContent="flex-start">
                  <VStack justifyContent="flex-start" alignItems="start">
                    {asset?.isOwner && (
                      <Text
                        color="grey.200"
                        fontWeight="semibold"
                        fontSize="20px"
                      >
                        <Badge variant="success" h={5}>
                          owner
                        </Badge>
                      </Text>
                    )}
                    <Text variant="description" fontSize="20px">
                      {AddressUtils.format(asset?.address)}
                    </Text>
                  </VStack>
                </HStack>
              </Card>
            );
          },
        )}
      </VStack>
    </Box>
  );
};

export { SignersDetails };
