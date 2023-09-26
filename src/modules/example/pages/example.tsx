import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { FaRegClone } from 'react-icons/fa';
import { HiQrCode } from 'react-icons/hi2';
import { MdEmail } from 'react-icons/md';
import { SiBitcoinsv } from 'react-icons/si';

import { Card, ErrorIcon, PendingIcon, SuccessIcon } from '@/components';

const ExamplePage = () => {
  return (
    <Container maxWidth="container.md" paddingY="10">
      {/* CARDS */}
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

      {/* BUTTONS */}
      <Box width="100%" mb={10}>
        <Heading size="lg">Button</Heading>
        <Box mt={4}>
          <HStack mb={2} spacing={2}>
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
          </HStack>
          <HStack mb={2} spacing={2}>
            <Card w="100%">
              <Box mb={3}>
                <Heading variant="title">Secondary</Heading>
              </Box>
              <Box>
                <Button variant="secondary">Decline</Button>
              </Box>
            </Card>
            <Card w="100%">
              <Box mb={3}>
                <Heading variant="title">Button icon</Heading>
              </Box>
              <HStack spacing={2}>
                <IconButton
                  aria-label="Copy"
                  variant="icon"
                  icon={<Icon as={FaRegClone} />}
                />
                <IconButton
                  aria-label="QR Code"
                  variant="icon"
                  icon={<Icon as={HiQrCode} />}
                />
                <IconButton
                  aria-label="Show in explorer"
                  variant="icon"
                  icon={<Icon as={BsBoxArrowUpRight} />}
                />
              </HStack>
            </Card>
          </HStack>
        </Box>
      </Box>

      {/* ICONS */}
      <Box width="100%" mb={10}>
        <Heading size="lg">Icons</Heading>
        <Box mt={4}>
          <HStack mb={2} spacing={2}>
            <Card w="100%">
              <HStack spacing={2}>
                <Icon as={PendingIcon} fontSize="xl" color="warning.500" />
                <Icon as={ErrorIcon} fontSize="xl" color="error.500" />
                <Icon as={SuccessIcon} fontSize="xl" color="success.500" />
              </HStack>
            </Card>
          </HStack>
        </Box>
      </Box>

      {/* BADGE */}
      <Box width="100%" mb={10}>
        <Heading size="lg">Badge</Heading>
        <Box mt={4}>
          <HStack mb={2} spacing={2}>
            <Card w="100%">
              <HStack spacing={2}>
                <Badge variant="success">
                  You signed
                  <Icon as={SuccessIcon} />
                </Badge>
                <Badge variant="error">
                  You declined
                  <Icon as={ErrorIcon} />
                </Badge>
                <Badge variant="warning">
                  <Icon as={PendingIcon} />1 waiting for your signature
                </Badge>
                <Badge variant="warning">
                  <Icon as={PendingIcon} /> 1
                </Badge>
              </HStack>
            </Card>
          </HStack>
        </Box>
      </Box>
    </Container>
  );
};

export { ExamplePage };
