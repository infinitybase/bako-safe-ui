import { Card, CopyIcon, EditIcon, RemoveIcon } from '@bako-safe/ui/components';
import {
  Avatar,
  Box,
  type CardProps,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Text,
  useClipboard,
  VStack,
} from '@chakra-ui/react';

import { useNotification } from '@/modules/notification';

import type { UseAddressBookReturn } from '../../hooks';

interface ContactCardProps extends CardProps {
  nickname: string;
  address: string;
  avatar: string;
  dialog: UseAddressBookReturn['dialog']['deleteContactDialog'];
  showActionButtons: boolean;
  handleDelete: () => void;
  handleEdit: () => void;
}

const ContactCard = ({
  nickname,
  address,
  avatar,
  showActionButtons,
  handleDelete,
  handleEdit,
  ...rest
}: ContactCardProps) => {
  const clipboard = useClipboard(address);
  const toast = useNotification();

  return (
    <Card
      display="flex"
      w="100%"
      borderColor="gradients.transaction-border"
      bg="gradients.transaction-card"
      borderWidth={1}
      backdropFilter="blur(16px)"
      dropShadow="0px 8px 6px 0px #00000026"
      {...rest}
    >
      <VStack flex={1} alignItems="flex-start">
        <HStack flex={1} justifyContent="space-between" mb={1}>
          <HStack>
            <Avatar variant="roundedSquare" src={avatar} key={address} />
            <Box ml={2}>
              <Heading
                variant="title-md"
                color="grey.200"
                maxW="300px"
                isTruncated
              >
                {nickname}
              </Heading>
              <Text
                variant="description"
                color="grey.500"
                wordBreak="break-word"
              >
                {address}
              </Text>
            </Box>
          </HStack>
        </HStack>

        <Divider borderColor="grey.600" my={1} />

        <HStack w="full" justifyContent={{ base: 'end', sm: 'start' }}>
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
                // icon: <Icon fontSize="2xl" color="brand.500" as={CheckIcon} />,
              });
            }}
          />
          {showActionButtons && (
            <>
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
            </>
          )}
        </HStack>
      </VStack>
    </Card>
  );
};

export { ContactCard };
