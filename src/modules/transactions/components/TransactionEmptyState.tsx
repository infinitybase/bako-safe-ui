import {
  Box,
  BoxProps,
  Button,
  Card,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';

import { EmptyBoxOutline } from '@/components';

interface TransactionEmptyStateProps extends BoxProps {
  isDisabled: boolean;
  buttonAction: () => void;
}

const TransactionEmptyState = ({
  isDisabled,
  buttonAction,
  ...rest
}: TransactionEmptyStateProps) => {
  return (
    <Card
      {...rest}
      w="full"
      p={20}
      bg="gradients.transaction-card"
      borderColor="gradients.transaction-border"
      backdropFilter="blur(16px)"
      dropShadow="0px 8px 6px 0px #00000026"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      <VStack spacing={0}>
        <Box mb={5}>
          <EmptyBoxOutline w={100} h={100} />
        </Box>
        <VStack spacing={6} maxW={400} mb={10}>
          <Heading color="grey.75" fontSize="xl" textAlign="center">
            Nothing to show here.
          </Heading>
          <Text
            color="grey.250"
            textAlign="center"
            fontWeight={400}
            variant="description"
          >
            It seems like you {"haven't"} any transaction yet.
          </Text>
        </VStack>
        <Button
          variant="emptyState"
          isDisabled={isDisabled}
          onClick={buttonAction}
          w="full"
        >
          Create transaction
        </Button>
      </VStack>
    </Card>
  );
};
export default TransactionEmptyState;
