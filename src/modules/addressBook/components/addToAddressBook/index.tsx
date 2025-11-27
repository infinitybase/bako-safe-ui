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
      <Text color="textSecondary" fontSize={12}>
        Do you wanna{' '}
        <Link color="primary.main" onClick={onAdd}>
          add this
        </Link>{' '}
        address in your address book?
      </Text>
    </Box>
  );
};

export { AddToAddressBook };
