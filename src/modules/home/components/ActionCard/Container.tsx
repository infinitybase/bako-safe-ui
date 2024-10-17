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
    <Card
      w="full"
      h="full"
      minH={102}
      bgColor="grey.700"
      borderColor="grey.325"
      display="flex"
      px={{ base: 4, sm: 6 }}
      py={{ base: 2, sm: 4 }}
      _hover={{
        borderColor: 'brand.500',
      }}
      overflow="hidden"
      cursor={isUpcoming ? '' : 'pointer'}
      {...rest}
    >
      <HStack>{children}</HStack>
    </Card>
  );
};

export { Container };
