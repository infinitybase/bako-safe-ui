import { Text } from '@chakra-ui/react';
import { format } from 'date-fns';

interface TransactionCardCreationDateProps {
  createdAt: Date;
}

const CreationDate = ({ createdAt }: TransactionCardCreationDateProps) => (
  <Text variant="subtitle" fontWeight="semibold" color="grey.200">
    {format(createdAt, 'EEE, dd MMM')}
  </Text>
);

export { CreationDate };
