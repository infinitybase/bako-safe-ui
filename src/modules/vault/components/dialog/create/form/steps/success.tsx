import { Icon, Stack, Text } from 'bako-ui';

import { DoneIcon } from '@/components/icons/done-icon';

const VaultSuccessStep = () => {
  return (
    <Stack p={0} h="full" alignItems="center" justifyContent="center" gap={6}>
      <Icon boxSize="48px" as={DoneIcon} />
      <Text fontWeight={700} fontSize="md" color="gray.50">
        The account has been created!
      </Text>
      <Text fontSize="sm" color="textSecondary">
        You can now create transactions.
      </Text>
    </Stack>
  );
};

export { VaultSuccessStep };
