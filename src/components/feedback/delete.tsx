import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  Separator,
  Text,
  VStack,
} from 'bako-ui';

import { RemoveUser } from '../icons/remove-user';

interface DeleteStepProps {
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  primaryAction?: string;
  secondaryAction?: string;
  showAction?: boolean;
  title: string;
  description?: string;
}

const FeedbackDelete = ({
  title,
  showAction,
  description,
  primaryAction,
  secondaryAction,
  onPrimaryAction,
  onSecondaryAction,
}: DeleteStepProps) => {
  return (
    <Flex
      flexDirection="column"
      mb={5}
      pt={{ xs: 40, sm: 'unset' }}
      pb={{ base: 0, sm: 5 }}
      h={{ base: 600, xs: 500, sm: 'unset' }}
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
            <Text>
              Are you sure you want to{' '}
              <Text textDecor="none" as={Link} color="white">
                remove this member
              </Text>{' '}
              from your workspace?
            </Text>
          )}
        </Heading>
      </Box>
      <VStack
        mt={{ base: 'auto', sm: 8 }}
        w={{ base: '80%' }}
        position={{ base: 'absolute', sm: 'unset' }}
        bottom={4}
      >
        <Separator
          maxW={440}
          hidden={!showAction}
          mb={8}
          borderColor="dark.100"
        />
        <HStack
          w="full"
          maxW={400}
          hidden={!showAction}
          gap={4}
          justifyContent="center"
        >
          <Button
            w="50%"
            // border="1px solid white"
            // bgColor="transparent"
            variant="outline"
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
            onClick={onPrimaryAction}
            _hover={{
              opacity: 0.8,
            }}
          >
            {primaryAction}
          </Button>
        </HStack>
      </VStack>
    </Flex>
  );
};

export { FeedbackDelete };
