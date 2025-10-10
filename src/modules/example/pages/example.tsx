import {
  Accordion,
  AccordionItem,
  Badge,
  Box,
  Button,
  Field,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Select,
  Text,
  useAccordionItemContext,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { FaRegClone } from 'react-icons/fa';
import { HiQrCode } from 'react-icons/hi2';
import { MdEmail } from 'react-icons/md';
import { SiBitcoinsv } from 'react-icons/si';

import {
  Card,
  Dialog,
  ErrorIcon,
  PendingIcon,
  SuccessIcon,
} from '@/components';

const AccordionTEste = () => {
  const accordionContext = useAccordionItemContext();
  const isOpen = accordionContext.open;

  return (
    <Button onClick={() => (isOpen ? onClose() : onOpen())}>
      Open <AccordionItemTrigger />
    </Button>
  );
};

const ExamplePage = () => {
  const dialogExample = useDisclosure();

  return (
    <Box>
      {/* CARDS */}
      <Box width="100%" mb={10}>
        <Heading size="lg">Card</Heading>
        <Box mt={4}>
          <HStack gap={2}>
            <Card w="100%">
              <Box mb={3}>
                <Heading variant="title-xl">Infinitybase</Heading>
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
                <Heading variant="title-xl">Infinitybase</Heading>
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
                <Heading variant="title-xl">Infinitybase</Heading>
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
          <VStack gap={4}>
            <Card w="100%">
              <HStack alignItems="center" gap={10}>
                <HStack alignItems="center" gap={2}>
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
              <HStack alignItems="center" gap={10}>
                <HStack alignItems="center" gap={2}>
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
              <HStack alignItems="center" gap={10}>
                <HStack alignItems="center" gap={2}>
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
          <HStack mb={2} gap={2}>
            <Card w="100%">
              <Box mb={3}>
                <Heading variant="title-xl">Primary</Heading>
              </Box>
              <Box>
                <Button variant="primary" onClick={dialogExample.onOpen}>
                  Open example modal
                </Button>
              </Box>
            </Card>
            <Card w="100%">
              <Box mb={3}>
                <Heading variant="title-xl">Primary with icon</Heading>
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
          <HStack mb={2} gap={2}>
            <Card w="100%">
              <Box mb={3}>
                <Heading variant="title-xl">Secondary</Heading>
              </Box>
              <Box>
                <Button variant="secondary">Decline</Button>
              </Box>
            </Card>
            <Card w="100%">
              <Box mb={3}>
                <Heading variant="title-xl">Button icon</Heading>
              </Box>
              <HStack gap={2}>
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
          <HStack mb={2} gap={2}>
            <Card w="100%">
              <HStack gap={2}>
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
          <HStack mb={2} gap={2}>
            <Card w="100%">
              <HStack gap={2}>
                <Badge variant="success">
                  You signed
                  <Icon as={SuccessIcon} />
                </Badge>
                <Badge variant="error">
                  You declined
                  <Icon as={ErrorIcon} />
                </Badge>
                <Badge variant="warning">
                  <Icon as={PendingIcon} />1 pending transaction
                </Badge>
                <Badge variant="warning">
                  <Icon as={PendingIcon} /> 1
                </Badge>
              </HStack>
            </Card>
          </HStack>
        </Box>
      </Box>

      {/* BUTTONS */}
      <Box width="100%" mb={10}>
        <Heading size="lg">Form</Heading>
        <Box mt={4}>
          <HStack mb={2} gap={2}>
            <Card flex={1}>
              <Box mb={3}>
                <Heading variant="title-xl">Input</Heading>
              </Box>
              <Box w="100%" py={2}>
                <Field.Root>
                  <Input placeholder=" " />
                  <FormLabel>First name</FormLabel>
                  {/* It is important that the Label comes after the Control due to css selectors */}
                </Field.Root>
              </Box>
              <Box w="100%" py={2}>
                <Field.Root>
                  <Input placeholder=" " />
                  <FormLabel>First name</FormLabel>
                  {/* It is important that the Label comes after the Control due to css selectors */}
                </Field.Root>
              </Box>
            </Card>
            <Card flex={1}>
              <Box mb={3}>
                <Heading variant="title-xl">Select</Heading>
              </Box>
              <Box w="100%" py={2}>
                <Field.Root>
                  <Select placeholder=" ">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </Select>
                  <FormLabel>First name</FormLabel>
                  {/* It is important that the Label comes after the Control due to css selectors */}
                </Field.Root>
              </Box>
            </Card>
          </HStack>
        </Box>
      </Box>

      {/* ACCORDION */}
      <Box width="100%" mb={10}>
        <Heading size="lg">Accordion</Heading>
        <Box mt={4}>
          <HStack mb={2} gap={2}>
            <Card flex={1}>
              <Accordion allowToggle>
                <AccordionItem>
                  <h2>
                    <AccordionTEste />
                  </h2>
                  <AccordionItemContent pb={4}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionItemContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </HStack>
        </Box>
      </Box>

      {/* DIALOG */}
      <Dialog.Modal
        isOpen={dialogExample.isOpen}
        onClose={dialogExample.onClose}
      >
        <Dialog.Header
          onClose={dialogExample.onClose}
          w="full"
          maxW={420}
          title="Modal example"
          description="You can view the details, members, and their roles in your workspace."
        />

        <Dialog.Body maxW={420}>
          <VStack>
            <Field.Root>
              <Input placeholder=" " />
              <FormLabel>First name</FormLabel>
            </Field.Root>
            <Field.Root>
              <Input placeholder=" " />
              <FormLabel>First name</FormLabel>
            </Field.Root>
          </VStack>
        </Dialog.Body>

        <Dialog.Actions maxW={420}>
          <Dialog.SecondaryAction onClick={dialogExample.onClose}>
            Cancel
          </Dialog.SecondaryAction>
          <Dialog.PrimaryAction>Continue</Dialog.PrimaryAction>
        </Dialog.Actions>
      </Dialog.Modal>
    </Box>
  );
};

export { ExamplePage };
