import { CheckIcon } from '@chakra-ui/icons';
import {
  Avatar,
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

import { Card, CopyIcon, EditIcon, RemoveIcon } from '@/components';
import { AddressUtils } from '@/modules/core';
import { useNotification } from '@/modules/notification';
import { limitName } from '@/utils';

import { UseAddressBookReturn } from '../../hooks';

interface ContactCardProps extends CardProps {
  nickname: string;
  address: string;
  avatar: string;
  dialog: UseAddressBookReturn['deleteContactDialog'];
  handleDelete: () => void;
  handleEdit: () => void;
}

const ContactCard = ({
  nickname,
  address,
  avatar,
  handleDelete,
  handleEdit,
  ...rest
}: ContactCardProps) => {
  const clipboard = useClipboard(address);
  const toast = useNotification();

  return (
    <Card bg="dark.300" w="100%" zIndex={100} {...rest}>
      <VStack alignItems="flex-start">
        <HStack w="100%" justifyContent="space-between" mb={1}>
          <HStack>
            <Avatar variant="roundedSquare" src={avatar} key={address} />

            <Box ml={2}>
              <Heading variant="title-md" color="grey.200" noOfLines={1}>
                {limitName(nickname)}
              </Heading>
              <Text variant="description" color="grey.500">
                {AddressUtils.format(address)}
              </Text>
            </Box>
          </HStack>
        </HStack>

        <Divider borderColor="dark.100" my={1} />

        <HStack>
          <IconButton
            aria-label="Copy"
            variant="icon"
            icon={<Icon as={CopyIcon} color="grey.200" fontSize={18} />}
            onClick={() => {
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

          <IconButton
            aria-label="Edit"
            variant="icon"
            icon={<Icon as={EditIcon} color="grey.200" fontSize={18} />}
            onClick={handleEdit}
          />

          <IconButton
            aria-label="Delete"
            variant="icon"
            icon={<Icon as={RemoveIcon} color="grey.200" fontSize={18} />}
            onClick={handleDelete}
          />
        </HStack>
      </VStack>
    </Card>
  );
};

export { ContactCard };
