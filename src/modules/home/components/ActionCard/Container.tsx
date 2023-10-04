import { HStack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card } from '@/components';

interface ActionCardContainerProps {
  children: ReactNode;
  isUpcoming?: boolean;
  navigateTo?: string;
}

const Container = ({
  children,
  isUpcoming,
  navigateTo,
}: ActionCardContainerProps) => {
  const navigate = useNavigate();

  return (
    <Card
      bg="dark.300"
      w="100%"
      cursor={isUpcoming ? '' : 'pointer'}
      onClick={() => navigateTo && navigate(navigateTo)}
    >
      <HStack>{children}</HStack>
    </Card>
  );
};

export { Container };
