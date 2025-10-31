import { Card, Text } from 'bako-ui';
import { memo } from 'react';

import { CreateVaultDialog } from '@/modules';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';

const CreateNewAccountCard = memo(() => {
  const dialog = useDisclosure();
  return (
    <>
      <Card.Root
        variant="outline"
        cursor="pointer"
        borderColor="gray.600"
        bg="transparent"
        rounded="2xl"
        w="full"
        h="full"
        onClick={dialog.onOpen}
        _hover={{
          '& p': { color: 'textPrimary' },
        }}
      >
        <Card.Body p={6} justifyContent="center">
          <Text
            fontSize="xs"
            color="textSecondary"
            textAlign="center"
            fontWeight="medium"
            transition="color 0.2s ease-in-out"
          >
            Create new account
          </Text>
        </Card.Body>
      </Card.Root>
      <CreateVaultDialog
        open={dialog.isOpen}
        onOpenChange={dialog.onOpenChange}
      />
    </>
  );
});

CreateNewAccountCard.displayName = 'CreateNewAccountCard';

export default CreateNewAccountCard;
