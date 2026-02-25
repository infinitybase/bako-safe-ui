import { Button, Icon, Text } from 'bako-ui';
import { memo } from 'react';

import { Plus2Icon } from '@/components/icons';
import { CreateVaultDialog } from '@/modules';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';

const CreateNewAccountButton = memo(() => {
  const dialog = useDisclosure();
  return (
    <>
      <Button
        size="xs"
        bg="gray.700"
        _hover={{
          bg: 'bg.muted',
        }}
        color="secondary.contrast"
        variant="subtle"
        px={{ base: 0, sm: 3 }}
        onClick={dialog.onOpen}
      >
        <Icon
          boxSize={4}
          as={Plus2Icon}
          display={{ base: 'inline', sm: 'none' }}
        />
        <Text display={{ base: 'none', sm: 'inline' }}>Create new</Text>
      </Button>
      <CreateVaultDialog
        open={dialog.isOpen}
        onOpenChange={dialog.onOpenChange}
      />
    </>
  );
});

CreateNewAccountButton.displayName = 'CreateNewAccountButton';

export default CreateNewAccountButton;
