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

import { Card } from '@/components';
import { User } from '@/modules/core/models/user';
import { limitCharacters, shortenHexString } from '@/utils';

interface VaultCardProps extends CardProps {
  name: string;
  address: string;
  members: User[];
}

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
          icon={<Icon as={FaRegClone} />}
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
              src={member.avatar}
              key={member.address}
            />
          ))}
        </AvatarGroup>
      </Box>
    </VStack>
  </Card>
);
