import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { MdEmail } from 'react-icons/md';
import { SiBitcoinsv } from 'react-icons/si';

import { Card } from '@/components';

const ExamplePage = () => {
  return (
    <Container maxWidth="container.md" paddingY="10">
      <Box width="100%" mb={10}>
        <Heading size="lg">Card</Heading>
        <Box mt={4}>
          <HStack spacing={2}>
            <Card w="100%">
              <Box mb={3}>
                <Heading variant="title">Infinitybase</Heading>
              </Box>
              <Box>
                <Text variant="description">
                  Setting Sail on a Journey to Unlock the Potential of
                  User-Centered Design.
                </Text>
              </Box>
            </Card>
            <Card w="100%">
              <Box mb={3}>
                <Heading variant="title">Infinitybase</Heading>
              </Box>
              <Box>
                <Text variant="description">
                  Setting Sail on a Journey to Unlock the Potential of
                  User-Centered Design.
                </Text>
              </Box>
            </Card>
            <Card w="100%">
              <Box mb={3}>
                <Heading variant="title">Infinitybase</Heading>
              </Box>
              <Box>
                <Text variant="description">
                  Setting Sail on a Journey to Unlock the Potential of
                  User-Centered Design.
                </Text>
              </Box>
            </Card>
          </HStack>
        </Box>
        <Box mt={4}>
          <VStack spacing={4}>
            <Card w="100%">
              <HStack alignItems="center" spacing={10}>
                <HStack alignItems="center" spacing={2}>
                  <Icon as={SiBitcoinsv} fontSize="lg" />
                  <Text color="grey.500">BTC</Text>
                </HStack>
                <Text variant="subtitle">Mon, 18 Sep</Text>
                <Box>
                  <Text variant="subtitle">- 0.0989</Text>
                  <Text variant="description">Amount sent</Text>
                </Box>
                <Box>
                  <Text variant="subtitle">Fuel annual perk</Text>
                  <Text variant="description">
                    When I hear the buzz of the little world...
                  </Text>
                </Box>
              </HStack>
            </Card>
            <Card w="100%" bgColor="warning.900" borderColor="warning.500">
              <HStack alignItems="center" spacing={10}>
                <HStack alignItems="center" spacing={2}>
                  <Icon as={SiBitcoinsv} fontSize="lg" />
                  <Text color="grey.500">BTC</Text>
                </HStack>
                <Text variant="subtitle">Mon, 18 Sep</Text>
                <Box>
                  <Text variant="subtitle">- 0.0989</Text>
                  <Text variant="description">Amount sent</Text>
                </Box>
                <Box>
                  <Text variant="subtitle">Fuel annual perk</Text>
                  <Text variant="description">
                    When I hear the buzz of the little world...
                  </Text>
                </Box>
              </HStack>
            </Card>
            <Card w="100%">
              <HStack alignItems="center" spacing={10}>
                <HStack alignItems="center" spacing={2}>
                  <Icon as={SiBitcoinsv} fontSize="lg" />
                  <Text color="grey.500">BTC</Text>
                </HStack>
                <Text variant="subtitle">Mon, 18 Sep</Text>
                <Box>
                  <Text variant="subtitle">- 0.0989</Text>
                  <Text variant="description">Amount sent</Text>
                </Box>
                <Box>
                  <Text variant="subtitle">Fuel annual perk</Text>
                  <Text variant="description">
                    When I hear the buzz of the little world...
                  </Text>
                </Box>
              </HStack>
            </Card>
          </VStack>
        </Box>
      </Box>

      <Box width="100%" mb={10}>
        <Heading size="lg">Button</Heading>
        <Box mt={4}>
          <HStack spacing={2}>
            <Card w="100%">
              <Box mb={3}>
                <Heading variant="title">Primary</Heading>
              </Box>
              <Box>
                <Button variant="primary">Sign</Button>
              </Box>
            </Card>
            <Card w="100%">
              <Box mb={3}>
                <Heading variant="title">Primary with icon</Heading>
              </Box>
              <Box>
                <Button
                  variant="primary"
                  fontWeight="bold"
                  leftIcon={<MdEmail />}
                >
                  Create New Vault
                </Button>
              </Box>
            </Card>
            <Card w="100%">
              <Box mb={3}>
                <Heading variant="title">Secondary</Heading>
              </Box>
              <Box>
                <Button variant="secondary">Decline</Button>
              </Box>
            </Card>
          </HStack>
        </Box>
      </Box>
    </Container>
  );
};

export { ExamplePage };
