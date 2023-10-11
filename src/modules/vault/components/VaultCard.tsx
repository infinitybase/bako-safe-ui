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
import { GoCopy } from 'react-icons/go';

import avatar from '@/assets/avatars/user-1.png';
import avatar2 from '@/assets/avatars/user-2.png';
import avatar3 from '@/assets/avatars/user-3.png';
import avatar4 from '@/assets/avatars/user-4.png';
import { Card } from '@/components';
import { limitCharacters, shortenHexString } from '@/utils';

interface VaultCardProps extends CardProps {
  name: string;
  address: string;
  members: string[];
}

const avatars = [avatar, avatar2, avatar3, avatar4];

export const VaultCard = ({
  name,
  address,
  members,
  ...rest
}: VaultCardProps) => (
  <Card bg="dark.300" w="100%" cursor="pointer" zIndex={100} {...rest}>
    <VStack alignItems="flex-start">
      <HStack w="100%" justifyContent="space-between" mb={1}>
        <HStack>
          <Avatar
            variant="roundedSquare"
            name={name}
            color="white"
            bg="grey.900"
          />
          <Box ml={2}>
            <Heading variant="title-md" color="grey.200">
              {limitCharacters(name, 18)}
            </Heading>
            <Text variant="description" color="grey.500">
              {shortenHexString(address)}
            </Text>
          </Box>
        </HStack>

        <IconButton
          aria-label="Copy"
          variant="icon"
          icon={<Icon as={GoCopy} color="grey.200" />}
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(address);
          }}
        />
      </HStack>

      <Divider borderColor="dark.100" my={1} />

      <Box>
        <Text variant="description">Members</Text>
        <AvatarGroup
          variant="roundedSquare"
          max={5}
          mt={1}
          size="sm"
          spacing={-2}
        >
          {members.map((member) => (
            <Avatar
              variant="roundedSquare"
              src={avatars[Math.floor(Math.random() * 4)]}
              key={member}
            />
          ))}
        </AvatarGroup>
      </Box>
    </VStack>
  </Card>
);
