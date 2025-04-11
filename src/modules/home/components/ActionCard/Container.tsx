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
      bg="linear-gradient(180deg, rgba(21, 20, 19, 0.15), rgba(21, 20, 19, 0.25), rgba(21, 20, 19, 0.5))"
      borderColor="grey.550"
      display="flex"
      px={{ base: 4, sm: 6 }}
      py={{ base: 3, sm: 6 }}
      _hover={{
        borderColor: 'brand.500',
        bg: 'grey.825',
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
