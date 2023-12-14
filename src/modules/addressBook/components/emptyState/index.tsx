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
      bgColor="dark.300"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      <Box mb={6}>
        <NotFoundIcon w={100} h={100} />
      </Box>
      <Box mb={5}>
        <Heading color="brand.500" fontSize="4xl">
          Nothing to show here.
        </Heading>
      </Box>
      <Box maxW={400} mb={8}>
        <Text color="white" fontSize="md" textAlign="center" fontWeight="bold">
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
