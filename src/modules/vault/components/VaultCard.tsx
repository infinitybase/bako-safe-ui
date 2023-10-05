import {
  Avatar,
  AvatarGroup,
  Box,
  CardProps,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaRegClone } from 'react-icons/fa';

import avatar from '@/assets/avatars/user-1.png';
import avatar2 from '@/assets/avatars/user-2.png';
import avatar3 from '@/assets/avatars/user-3.png';
import avatar4 from '@/assets/avatars/user-4.png';
import avatar5 from '@/assets/avatars/user-5.png';
import { Card } from '@/components';
import { shortenHexString } from '@/utils/shorten-hex-string';

interface VaultCardProps extends CardProps {
  name: string;
  address: string;
  members: string[];
}

export const VaultCard = ({ name, address, ...rest }: VaultCardProps) => (
  <Card w="100%" cursor="pointer" {...rest}>
    <VStack alignItems="flex-start">
      <HStack w="100%" justifyContent="space-between" mb={1}>
        <HStack>
          <Avatar name={name} color="white" bg="grey.900" />
          <Box ml={2}>
            <Heading variant="title-md" color="grey.200">
              {name}
            </Heading>
            <Text variant="description" color="grey.500">
              {shortenHexString(address)}
            </Text>
          </Box>
        </HStack>

        <IconButton
          aria-label="Copy"
          variant="icon"
          icon={<Icon as={FaRegClone} />}
          onClick={() => navigator.clipboard.writeText(address)}
        />
      </HStack>

      <Divider borderColor="dark.100" my={2} />

      <Box>
        <Text variant="description">Its signers</Text>
        <AvatarGroup max={5} mt={1} size="sm" spacing={-2}>
          <Avatar name="Fábio Nascimento Teste" src={avatar} />
          <Avatar name="Fábio Nascimento" src={avatar2} />
          <Avatar name="Fábio Nascimento" src={avatar3} />
          <Avatar name="Fábio Nascimento" src={avatar4} />
          <Avatar name="Fábio Nascimento" src={avatar5} />
          <Avatar name="Fábio Nascimento" src={avatar5} />
          <Avatar name="Fábio Nascimento" src={avatar5} />
          <Avatar name="Fábio Nascimento" src={avatar5} />
        </AvatarGroup>
      </Box>
    </VStack>
  </Card>
);
