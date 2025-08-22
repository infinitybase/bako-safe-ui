import type { CardProps } from '@chakra-ui/react';

import { Card } from '@/components';

interface RootProps extends CardProps {
  children: React.ReactNode;
}

export const Root = ({ children, ...props }: RootProps) => {
  return (
    <Card
      p={0}
      borderRadius="8px"
      backdropFilter="none"
      maxW="400px"
      minW={{
        xl: '150px',
      }}
      mx={{
        base: 'auto',
      }}
      {...props}
    >
      {children}
    </Card>
  );
};
