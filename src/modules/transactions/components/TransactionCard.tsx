import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  Collapse,
  Heading,
  HStack,
  Icon,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import { Card, ErrorIcon, SuccessIcon } from '@/components';
import { limitCharacters } from '@/utils';

interface TransactionCardProps {
  isPending?: boolean;
  isSigned?: boolean;
  isDeclined?: boolean;
  isCompleted?: boolean;
  transaction: {
    vault: {
      name: string;
      description?: string;
    };
    created_at: Date;
  };
}

export const TransactionCardOld = ({
  isPending,
  isSigned,
  isDeclined,
  isCompleted,
  transaction: { vault, created_at },
}: TransactionCardProps) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);

  return (
    <Card
      w="full"
      bgColor={isPending ? 'warning.800' : 'dark.300'}
      borderColor={isPending ? 'warning.500' : 'dark.100'}
    >
      <VStack w="full">
        <HStack w="full" alignItems="center" spacing={10}>
          <Avatar
            variant="roundedSquare"
            name="Vault Name"
            color="white"
            bg="grey.900"
            w="38px"
            h="38px"
            fontSize="small"
          />

          <HStack>
            <Box mt={0.5} ml={-6}>
              <Heading variant="title-md" color="grey.200">
                {vault.name}
              </Heading>
              {vault.description && (
                <Text variant="description" fontSize="sm" color="grey.500">
                  {limitCharacters(vault.description, 20)}
                </Text>
              )}
            </Box>
          </HStack>

          <Text variant="subtitle" fontWeight="semibold" color="grey.200">
            {format(created_at, 'EEE, dd MMM')}
          </Text>

          <AvatarGroup max={2}>
            <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
            <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
            <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
            <Avatar
              name="Prosper Otemuyiwa"
              src="https://bit.ly/prosper-baba"
            />
          </AvatarGroup>

          <HStack>
            <Box mt={0.5}>
              <Heading variant="title-md" color="grey.200">
                1,800 USD
              </Heading>
              <Text variant="description" fontSize="sm" color="grey.500">
                Amount sent
              </Text>
            </Box>
          </HStack>

          <HStack>
            <Box>
              <Heading variant="title-md" color="grey.200">
                Fuel annual perk
              </Heading>
              <Text variant="description" fontSize="sm" color="grey.500">
                Transaction
              </Text>
            </Box>
          </HStack>

          <VStack spacing={0}>
            <Badge
              h={6}
              variant={
                isDeclined ? 'error' : isCompleted ? 'success' : 'warning'
              }
            >
              {isCompleted ? 'Completed' : isDeclined ? 'Declined' : '2/4 Sgd'}
            </Badge>
            <Text variant="description" fontSize="sm" color="grey.500">
              Transfer status
            </Text>
          </VStack>

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

          <Icon
            as={open ? IoIosArrowUp : IoIosArrowDown}
            fontSize="2xl"
            color="grey.200"
            cursor="pointer"
            onClick={toggleOpen}
          />
        </HStack>

        <Collapse in={open}>
          <Text>Okokokoko</Text>
          <Text>Okokokoko</Text>
          <Text>Okokokoko</Text>
        </Collapse>
      </VStack>
    </Card>
  );
};
