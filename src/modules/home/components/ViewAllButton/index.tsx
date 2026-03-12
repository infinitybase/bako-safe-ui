import { Button, Icon, Text } from 'bako-ui';
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChevronRightIcon } from '@/components/icons';
import { Pages } from '@/modules';

const ViewAllButton = memo(({ workspaceId }: { workspaceId: string }) => {
  const navigate = useNavigate();

  const handleNavigateToAllVaults = useCallback(() => {
    navigate(Pages.userVaults({ workspaceId }));
  }, [navigate, workspaceId]);

  return (
    <Button
      size="xs"
      bg="gray.700"
      _hover={{
        bg: 'bg.muted',
      }}
      color="secondary.contrast"
      variant="subtle"
      px={{ base: 0, sm: 3 }}
      onClick={handleNavigateToAllVaults}
    >
      <Icon
        boxSize={4}
        as={ChevronRightIcon}
        display={{ base: 'inline', sm: 'none' }}
      />
      <Text display={{ base: 'none', sm: 'inline' }}>View all</Text>
    </Button>
  );
});

ViewAllButton.displayName = 'ViewAllButton';

export default ViewAllButton;
