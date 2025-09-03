import type { CardProps } from '@chakra-ui/react';

import { Card } from '@/components';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface RootProps extends CardProps {
  children: React.ReactNode;
}

export const Root = ({ children, ...props }: RootProps) => {
  const {
    screenSizes: { isLitteSmall },
  } = useWorkspaceContext();
  return (
    <Card
      borderWidth="1px"
      borderColor="gradients.transaction-border"
      backgroundColor="dark.50"
      backgroundImage="gradients.transaction-card"
      backdropFilter="blur(6px)"
      boxShadow="lg"
      borderRadius={isLitteSmall ? 5 : 8}
      p={isLitteSmall ? 1 : 2}
      {...props}
    >
      {children}
    </Card>
  );
};
