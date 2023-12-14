import { CheckIcon } from '@chakra-ui/icons';
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
  useClipboard,
  VStack,
} from '@chakra-ui/react';

import { Card, CopyIcon } from '@/components';
import { AddressUtils } from '@/modules/core';
import { User } from '@/modules/core/models/user';
import { useNotification } from '@/modules/notification';

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
}: VaultCardProps) => {
  const clipboard = useClipboard(address);
  const toast = useNotification();

  return (
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
              <Heading
                maxW={{ lg: 28, xl: 130, '2xl': 180 }}
                variant="title-md"
                color="grey.200"
                isTruncated
              >
                {name}
              </Heading>
              <Text variant="description" color="grey.500">
                {AddressUtils.format(address)}
              </Text>
            </Box>
          </HStack>

          <IconButton
            aria-label="Copy"
            variant="icon"
            icon={<Icon as={CopyIcon} color="grey.200" fontSize={17} />}
            onClick={(e) => {
              e.stopPropagation();
              clipboard.onCopy();
              toast({
                position: 'top-right',
                duration: 2000,
                isClosable: false,
                title: 'Copied to clipboard',
                icon: <Icon fontSize="2xl" color="brand.500" as={CheckIcon} />,
              });
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
            {members.map(({ avatar, address }) => (
              <Avatar variant="roundedSquare" src={avatar} key={address} />
            ))}
          </AvatarGroup>
        </Box>
      </VStack>
    </Card>
  );
};
