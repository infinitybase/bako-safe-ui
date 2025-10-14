import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Separator,
  Text,
  VStack,
} from 'bako-ui';

import TransactionsBoxIcon from '@/assets/transactions-icon.png';

interface SuccessStepProps {
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  primaryAction?: string;
  secondaryAction?: string;
  showAction?: boolean;
  title: string;
  description: string;
  membersFormIcon?: React.ElementType;
  hasCloseButton?: boolean;
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
  hasCloseButton,
}: SuccessStepProps) => {
  return (
    <Flex
      mt={hasCloseButton ? -8 : 'unset'}
      flexDirection="column"
      pt={{ xs: 40, sm: 'unset' }}
      h={{ base: 600, xs: 500, sm: 'unset' }}
    >
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
      <Box maxW={500}>
        <Text
          color="grey.400"
          fontSize={{ base: 'sm', sm: 'md' }}
          textAlign="center"
        >
          {description}
        </Text>
      </Box>

      <VStack
        mt={{ base: 'auto', sm: 8 }}
        w={{ base: '80%', sm: '100%' }}
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
          hidden={!showAction}
          gap={{ base: 2, xs: 4 }}
          justifyContent="center"
        >
          <Button
            w={{ base: '50%', xs: '45%' }}
            border="1px solid white"
            bgColor="transparent"
            variant="outline"
            fontSize={{ base: 'xs', xs: 'unset' }}
            onClick={onSecondaryAction}
            _hover={{
              borderColor: 'brand.500',
              color: 'brand.500',
            }}
          >
            {secondaryAction}
          </Button>
          <Button
            w={{ base: '50%', xs: '45%' }}
            border="none"
            bgColor="brand.500"
            fontSize={{ base: 'xs', xs: 'unset' }}
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

export { FeedbackSuccess };
