interface TransactionCardStatusProps {
  isDeclined?: boolean;
  isCompleted?: boolean;
}
import { Badge, Text, VStack } from '@chakra-ui/react';

const Status = ({ isDeclined, isCompleted }: TransactionCardStatusProps) => (
  <VStack spacing={0}>
    <Badge
      h={5}
      variant={isDeclined ? 'error' : isCompleted ? 'success' : 'warning'}
    >
      {isCompleted ? 'Completed' : isDeclined ? 'Declined' : '2/4 Sgd'}
    </Badge>
    <Text variant="description" fontSize="sm" color="grey.500">
      Transfer status
    </Text>
  </VStack>
);

export { Status };
