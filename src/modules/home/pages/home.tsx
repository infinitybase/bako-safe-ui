import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CgList } from 'react-icons/cg';
import { FaRegPlusSquare } from 'react-icons/fa';
import { GoArrowSwitch } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';

import { Card, HomeIcon, VaultIcon } from '@/components';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <VStack w="full" spacing={6}>
      <HStack w="full" h="10" justifyContent="space-between">
        <HStack>
          <Icon as={HomeIcon} fontSize="lg" color="grey.200" />
          <Text color="grey.200" fontWeight="semibold">
            Home
          </Text>
        </HStack>
        <Box>
          <Button
            variant="primary"
            fontWeight="bold"
            leftIcon={<FaRegPlusSquare />}
            onClick={() => alert('ok')}
          >
            Create vault
          </Button>
        </Box>
      </HStack>
      <HStack spacing={6}>
        <Card
          bg="dark.300"
          w="100%"
          cursor="pointer"
          onClick={() => navigate('/predicate')}
        >
          <HStack>
            <Flex alignItems="center" justifyContent="center" mr={3}>
              <Box
                h="80px"
                w="80px"
                bg="brand.500"
                opacity="0.1"
                borderRadius={10}
              />
              <Icon as={VaultIcon} position="absolute" />
            </Flex>
            <Box>
              <Box mb={3}>
                <Heading variant="title-xl" color="grey.200">
                  Vaults
                </Heading>
              </Box>
              <Box>
                <Text variant="description">
                  Setting Sail on a Journey to Unlock the Potential of
                  User-Centered Design.
                </Text>
              </Box>
            </Box>
          </HStack>
        </Card>
        <Card w="100%" bg="dark.300" cursor="pointer">
          <HStack>
            <Flex alignItems="center" justifyContent="center" mr={3}>
              <Box
                h="80px"
                w="80px"
                bg="brand.500"
                opacity="0.1"
                borderRadius={10}
              />
              <Icon
                as={GoArrowSwitch}
                color="brand.500"
                fontSize={30}
                position="absolute"
              />
            </Flex>
            <Box>
              <Box mb={3}>
                <Heading variant="title-xl" color="grey.200">
                  Transactions
                </Heading>
              </Box>
              <Box>
                <Text variant="description">
                  Setting Sail on a Journey to Unlock the Potential of
                  User-Centered Design.
                </Text>
              </Box>
            </Box>
          </HStack>
        </Card>
        <Card w="100%" bg="dark.300">
          <HStack>
            <Flex alignItems="center" justifyContent="center" mr={3}>
              <Box
                h="80px"
                w="80px"
                bg="grey.500"
                opacity="0.2"
                borderRadius={10}
              />
              <Icon
                as={CgList}
                position="absolute"
                color="grey.500"
                fontSize={30}
              />
            </Flex>
            <Box>
              <Flex mb={3} alignItems="center">
                <Heading variant="title-xl" color="grey.200">
                  Address book
                </Heading>
                <Badge h="5" variant="warning" ml={3}>
                  Upcoming
                </Badge>
              </Flex>
              <Box>
                <Text variant="description">
                  Setting Sail on a Journey to Unlock the Potential of
                  User-Centered Design.
                </Text>
              </Box>
            </Box>
          </HStack>
        </Card>
      </HStack>
    </VStack>
  );
};

export { HomePage };
