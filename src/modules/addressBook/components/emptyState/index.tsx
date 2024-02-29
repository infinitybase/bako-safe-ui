import { Box, Button, Card, Heading, Text } from '@chakra-ui/react';

import { NotFoundIcon, SquarePlusIcon } from '@/components';

interface AddressBookEmptyStateProps {
  action: () => void;
}

const AddressBookEmptyState = ({ action }: AddressBookEmptyStateProps) => {
  return (
    <Card
      w="full"
      p={20}
      bgColor="grey.850"
      display="flex"
      borderWidth={2}
      borderColor="grey.300"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      <Box mb={6}>
        <NotFoundIcon w={100} h={100} />
      </Box>
      <Box mb={5}>
        <Heading color="white" fontSize="4xl">
          Nothing to show here.
        </Heading>
      </Box>
      <Box maxW={400} mb={8}>
        <Text
          color="grey.450"
          fontSize="md"
          textAlign="center"
          fontWeight="medium"
        >
          It seems like you {"haven't"} create any favorite yet. Would you like
          to create one now?
        </Text>
      </Box>
      <Button variant="primary" leftIcon={<SquarePlusIcon />} onClick={action}>
        Add new favorite
      </Button>
    </Card>
  );
};

export { AddressBookEmptyState };
