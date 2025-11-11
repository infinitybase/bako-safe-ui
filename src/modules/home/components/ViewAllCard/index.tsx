import { Card, Text } from 'bako-ui';
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pages } from '@/modules';

const ViewAllCard = memo(({ workspaceId }: { workspaceId: string }) => {
  const navigate = useNavigate();

  const handleNavigateToAllVaults = useCallback(() => {
    navigate(Pages.userVaults({ workspaceId }));
  }, [navigate, workspaceId]);

  return (
    <Card.Root
      variant="outline"
      cursor="pointer"
      borderColor="gray.600"
      bg="transparent"
      rounded="2xl"
      w="full"
      h="full"
      onClick={handleNavigateToAllVaults}
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
          View all
        </Text>
      </Card.Body>
    </Card.Root>
  );
});

ViewAllCard.displayName = 'ViewAllCard';

export default ViewAllCard;
