import {
  Avatar,
  Box,
  CardRootProps,
  Heading,
  HStack,
  Icon,
  IconButton,
  Separator,
  Text,
  useClipboard,
  VStack,
} from 'bako-ui';
import { FiCheck as CheckIcon } from 'react-icons/fi';

import { Card, CopyIcon, EditIcon, RemoveIcon } from '@/components';
import { useNotification } from '@/modules/notification';

import { UseAddressBookReturn } from '../../hooks';

interface ContactCardProps extends CardRootProps {
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
  const clipboard = useClipboard({ value: address });
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
            <Avatar
              shape="rounded"
              key={address}
              src={avatar}
              name={nickname || address}
            />
            <Box ml={2}>
              <Heading
                // variant="title-md"
                color="grey.200"
                maxW="300px"
                truncate
              >
                {nickname}
              </Heading>
              <Text
                // variant="description"
                color="grey.500"
                wordBreak="break-word"
              >
                {address}
              </Text>
            </Box>
          </HStack>
        </HStack>

        <Separator borderColor="grey.600" my={1} />

        <HStack w="full" justifyContent={{ base: 'end', sm: 'start' }}>
          <IconButton
            aria-label="Copy"
            onClick={() => {
              clipboard.copy();
              toast({
                position: 'top-right',
                duration: 2000,
                isClosable: false,
                title: 'Copied to clipboard',
                icon: <Icon fontSize="2xl" color="brand.500" as={CheckIcon} />,
              });
            }}
          >
            <CopyIcon />
          </IconButton>
          {showActionButtons && (
            <>
              <IconButton
                aria-label="Edit"
                // variant="icon"
                // icon={<Icon as={} color="grey.200" fontSize={18} />}
                onClick={handleEdit}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="Delete"
                // variant="icon"
                // icon={<Icon as={RemoveIcon} color="grey.200" fontSize={18} />}
                onClick={handleDelete}
              >
                <RemoveIcon />
              </IconButton>
            </>
          )}
        </HStack>
      </VStack>
    </Card>
  );
};

export { ContactCard };
