import { Box, Link, Text } from 'bako-ui';

import { useAddToAddressBook } from '../../hooks';

interface AddToAddressBookProps {
  visible?: boolean;
  onAdd: () => void;
}

const AddToAddressBook = ({ visible = true, onAdd }: AddToAddressBookProps) => {
  const { visibleDelayed } = useAddToAddressBook(visible);

  if (!visibleDelayed) return null;

  return (
    <Box mt={2}>
      <Text color="grey.425" fontSize={12}>
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
