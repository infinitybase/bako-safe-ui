import { CardRootProps, HStack } from 'bako-ui';
import { ReactNode } from 'react';

import { Card } from '@/components';

interface ActionCardContainerProps extends CardRootProps {
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
      bgColor="grey.825"
      borderColor="grey.550"
      display="flex"
      px={{ base: 4, sm: 6 }}
      py={{ base: 3, sm: 6 }}
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
