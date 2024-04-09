import { Box, Link, Text } from '@chakra-ui/react';

interface AddToAddressBookProps {
  onAdd: () => void;
}

const AddToAddressBook = ({ onAdd }: AddToAddressBookProps) => {
  return (
    <Box mt={2}>
      <Text color="grey.200" fontSize={12}>
        Do you wanna{' '}
        <Link color="brand.500" onClick={onAdd}>
          add this
        </Link>{' '}
        address in your address book?
      </Text>
    </Box>
  );
};

export { AddToAddressBook };
