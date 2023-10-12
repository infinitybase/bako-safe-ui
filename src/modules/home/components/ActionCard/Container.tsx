import { CardProps, HStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { Card } from '@/components';

interface ActionCardContainerProps extends CardProps {
  children: ReactNode;
  isUpcoming?: boolean;
}

const Container = ({
  children,
  isUpcoming,
  ...rest
}: ActionCardContainerProps) => {
  return (
    <Card w="100%" cursor={isUpcoming ? '' : 'pointer'} {...rest}>
      <HStack>{children}</HStack>
    </Card>
  );
};

export { Container };
