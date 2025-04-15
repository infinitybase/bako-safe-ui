import { Avatar, Box, Flex, Icon, Text, VStack } from '@chakra-ui/react';
import { MdOutlineContacts, MdOutlineSend } from 'react-icons/md';

import { UseTransactionSocket } from '../../hooks';
import {
  SimplifiedOperation,
  TxCategory,
} from '../../services/simplify-transaction';

type DappTransactionCardProps = {
  operation: SimplifiedOperation;
  vault?: UseTransactionSocket['vault'];
};

export function DappTransactionOperationCard({
  operation,
  vault,
}: DappTransactionCardProps) {
  const isContract = operation.type === TxCategory.CONTRACTCALL;
  const isTransfer = operation.type === TxCategory.SEND;
  console.log(isContract, isTransfer, vault, operation);
  return (
    <VStack spacing="0" align="stretch" w="100%">
      {/* Vault 1 */}
      <Flex align="center" gap="10px" pb="2" pl="1">
        <Box
          bg="gray.700"
          color="white"
          fontWeight="bold"
          fontSize="xs"
          px="2"
          py="1"
          borderRadius="md"
        >
          PV
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="semibold">
            Personal Vault
          </Text>
          <Text fontSize="xs" color="gray.500">
            0xfu...2928
          </Text>
        </Box>
      </Flex>

      {/* Operation 1 - Calling contract */}
      <Flex ml="18px" pl="9px" borderLeft="2px solid" borderColor="gray.500">
        <VStack spacing="0" align="flex-start">
          <Flex align="center" gap="8px" py="1">
            <Icon as={MdOutlineContacts} color="yellow.500" boxSize="5" />
            <Text fontSize="sm" color="orange.400" fontWeight="medium">
              Calling contract
            </Text>
          </Flex>
          <Flex align="center" gap="8px" pb="3">
            <Text fontSize="sm" color="blue.400" fontWeight="medium">
              ⧫ 0.0458 ETH ~ $175.43
            </Text>
          </Flex>
        </VStack>
      </Flex>

      {/* Middle entity */}
      <Flex align="center" gap="10px" pb="2" pl="1" pt="1">
        <Avatar bg="green.500" name="Mira V1 Core" size="sm" />
        <Box>
          <Text fontSize="sm" fontWeight="semibold">
            Mira V1 Core
          </Text>
          <Text fontSize="xs" color="gray.500">
            0xfu...2928
          </Text>
        </Box>
      </Flex>

      {/* Operation 2 - Sending funds */}
      <Flex ml="18px" pl="9px" borderLeft="2px solid" borderColor="gray.500">
        <VStack spacing="0" align="flex-start">
          <Flex align="center" gap="8px" py="1">
            <Icon as={MdOutlineSend} color="yellow.500" boxSize="5" />
            <Text fontSize="sm" color="orange.400" fontWeight="medium">
              Sending funds
            </Text>
          </Flex>
          <Flex align="center" gap="8px" pb="3">
            <Text fontSize="sm" color="blue.400" fontWeight="medium">
              ⧫ 0.0457 ~ $173.87
            </Text>
          </Flex>
        </VStack>
      </Flex>

      {/* Vault 2 */}
      <Flex align="center" gap="10px" pt="2" pl="1">
        <Box
          bg="gray.700"
          color="white"
          fontWeight="bold"
          fontSize="xs"
          px="2"
          py="1"
          borderRadius="md"
        >
          OV
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="semibold">
            Other vault
          </Text>
          <Text fontSize="xs" color="gray.500">
            0xfu...7894
          </Text>
        </Box>
      </Flex>
    </VStack>
  );
}
