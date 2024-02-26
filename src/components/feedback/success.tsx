import { Icon } from '@chakra-ui/icons';
import {
  As,
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Image,
  Text,
} from '@chakra-ui/react';

import TransactionsBoxIcon from '@/assets/transactions-icon.png';

interface SuccessStepProps {
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  primaryAction?: string;
  secondaryAction?: string;
  showAction?: boolean;
  title: string;
  description: string;
  membersFormIcon?: As;
}

const FeedbackSuccess = ({
  title,
  showAction,
  description,
  primaryAction,
  secondaryAction,
  onPrimaryAction,
  onSecondaryAction,
  membersFormIcon,
}: SuccessStepProps) => (
  <Center overflowX="hidden" flexDirection="column" mb={12}>
    <Box m={8}>
      {membersFormIcon ? (
        <Icon fontSize={100} as={membersFormIcon} />
      ) : (
        <Image src={TransactionsBoxIcon} />
      )}
    </Box>
    <Box mb={5}>
      <Heading fontSize="2xl" color="white">
        {title}
      </Heading>
    </Box>
    <Box maxW={650}>
      <Text color="grey.400" fontSize="md" textAlign="center">
        {description}
      </Text>
    </Box>
    <Divider
      borderWidth={1}
      hidden={!showAction}
      my={8}
      borderColor="dark.100"
    />
    <HStack w="full" hidden={!showAction} spacing={4} justifyContent="center">
      <Button
        w="45%"
        border="1px solid white"
        bgColor="transparent"
        variant="secondary"
        onClick={onSecondaryAction}
        _hover={{
          borderColor: 'brand.500',
          color: 'brand.500',
        }}
      >
        {secondaryAction}
      </Button>
      <Button
        w="45%"
        border="none"
        bgColor="brand.500"
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

export { FeedbackSuccess };
