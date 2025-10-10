import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Link,
  Spacer,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FaRegClone } from 'react-icons/fa';
import { SiBitcoinsv } from 'react-icons/si';

import vault1 from '@/assets/avatars/vault-1.png';
import vault2 from '@/assets/avatars/vault-2.png';
import { Card, ErrorIcon, PendingIcon, SuccessIcon } from '@/components';

/* TODO: Move to vault module */
const VaultCard = ({ avatarSrc }: { avatarSrc: string }) => (
  <Card p={7}>
    <HStack mb={6} gap={6}>
      {/* <Avatar name="Vault 1" src={avatarSrc} size="80px" /> */}
      <Box maxW={280}>
        <Box mb={3}>
          <Heading variant="title-xl">Infinitybase</Heading>
        </Box>
        <Box>
          <Text variant="description">
            Setting Sail on a Journey to Unlock the Potential of User-Centered
            Design.
          </Text>
        </Box>
      </Box>
    </HStack>
    <HStack gap={5}>
      <HStack bgColor="dark.100" gap={5} borderRadius={10} py={3} px={3}>
        <Text variant="description">0xf3f2x0870e...c3</Text>
        <Icon as={FaRegClone} color="grey.500" />
      </HStack>
      {/* <AvatarGroup max={5}>
        <Avatar name="Fábio Nascimento" src={avatar} />
        <Avatar name="Fábio Nascimento" src={avatar2} />
        <Avatar name="Fábio Nascimento" src={avatar3} />
        <Avatar name="Fábio Nascimento" src={avatar4} />
        <Avatar name="Fábio Nascimento" src={avatar5} />
      </AvatarGroup> */}
    </HStack>
  </Card>
);

const TransactionCard = ({
  isPending,
  isSigned,
  isDeclined,
}: {
  isPending?: boolean;
  isSigned?: boolean;
  isDeclined?: boolean;
}) => (
  <Card
    w="100%"
    bgColor={isPending ? 'warning.800' : 'dark.300'}
    borderColor={isPending ? 'warning.500' : 'dark.100'}
  >
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
      {/* <AvatarGroup max={5}>
        <Avatar name="Fábio Nascimento" src={avatar} />
        <Avatar name="Fábio Nascimento" src={avatar2} />
        <Avatar name="Fábio Nascimento" src={avatar3} />
      </AvatarGroup> */}
      <Spacer />
      {isSigned && (
        <Badge variant="success">
          You signed
          <Icon as={SuccessIcon} />
        </Badge>
      )}
      {isDeclined && (
        <Badge variant="error">
          You declined
          <Icon as={ErrorIcon} />
        </Badge>
      )}
      {isPending && (
        <HStack>
          <Button variant="primary">Sign</Button>
          <Button variant="secondary">Decline</Button>
        </HStack>
      )}
    </HStack>
  </Card>
);

const ExampleHomePage = () => {
  return (
    <Box w="100%">
      {/* VAULT LIST */}
      <Box mb={12}>
        <Box mb={5}>
          <Text variant="subtitle" fontSize="xl">
            Vaults
          </Text>
        </Box>
        <Wrap gap={7}>
          <WrapItem>
            <VaultCard avatarSrc={vault1} />
          </WrapItem>
          <WrapItem>
            <VaultCard avatarSrc={vault2} />
          </WrapItem>
          <WrapItem>
            <VaultCard avatarSrc={vault2} />
          </WrapItem>
          <WrapItem>
            <VaultCard avatarSrc={vault1} />
          </WrapItem>
          <WrapItem>
            <VaultCard avatarSrc={vault1} />
          </WrapItem>
          <WrapItem>
            <VaultCard avatarSrc={vault2} />
          </WrapItem>
        </Wrap>
      </Box>

      {/* TRANSACTION LIST */}
      <Box mb={10}>
        <HStack gap={4} mb={5}>
          <Text variant="subtitle" fontSize="xl">
            Transactions
          </Text>
          <Badge variant="warning">
            <Icon as={PendingIcon} />1 pending transaction
          </Badge>
          <Spacer />
          <Link color="brand.500">View all</Link>
        </HStack>
        <VStack gap={4}>
          <TransactionCard isSigned />
          <TransactionCard isPending />
          <TransactionCard isDeclined />
        </VStack>
      </Box>
    </Box>
  );
};

export { ExampleHomePage };
