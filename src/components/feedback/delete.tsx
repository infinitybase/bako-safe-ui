import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  Link,
  Text,
} from '@chakra-ui/react';

import { RemoveUser } from '../icons/remove-user';

interface DeleteStepProps {
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  primaryAction?: string;
  secondaryAction?: string;
  showAction?: boolean;
  title: string;
  description?: string;
  hasCloseButton?: boolean;
}

const FeedbackDelete = ({
  title,
  showAction,
  description,
  primaryAction,
  secondaryAction,
  onPrimaryAction,
  onSecondaryAction,
  hasCloseButton,
}: DeleteStepProps) => {
  return (
    <Center
      mt={hasCloseButton ? 0 : 14}
      flexDirection="column"
      minH={{ base: 680, xs: 650, sm: 'unset' }}
      pt={{ base: 40, sm: 'unset' }}
      pb={{ base: 0, sm: 5 }}
    >
      <Box m={8}>
        <Icon fontSize={100} as={RemoveUser} />
      </Box>
      <Box mb={5}>
        <Heading color="white">{title}</Heading>
      </Box>
      <Box maxW={450} mb={5}>
        <Heading
          color="grey.200"
          fontSize="md"
          fontWeight="medium"
          textAlign="center"
        >
          {description ? (
            description
          ) : (
            <Text variant="description">
              Are you sure you want to{' '}
              <Text textDecor="none" as={Link} color="white">
                remove this member
              </Text>{' '}
              from your workspace?
            </Text>
          )}
        </Heading>
      </Box>
      <Divider
        maxW={400}
        hidden={!showAction}
        mt={{ base: 'auto', sm: 8 }}
        mb={8}
        borderColor="dark.100"
      />
      <HStack
        w="full"
        maxW={400}
        hidden={!showAction}
        spacing={4}
        justifyContent="center"
      >
        <Button
          w="50%"
          border="1px solid white"
          bgColor="transparent"
          variant="secondary"
          onClick={onSecondaryAction}
          _hover={{
            opacity: 0.8,
          }}
        >
          {secondaryAction}
        </Button>
        <Button
          w="50%"
          border="none"
          bgColor="error.500"
          variant="primary"
          onClick={onPrimaryAction}
          _hover={{
            opacity: 0.8,
          }}
        >
          {primaryAction}
        </Button>
      </HStack>
    </Center>
  );
};

export { FeedbackDelete };
