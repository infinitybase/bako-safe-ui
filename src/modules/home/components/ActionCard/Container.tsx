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
      bgColor="transparent"
      display="flex"
      px={[4, 6]}
      py={[3, 6]}
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
