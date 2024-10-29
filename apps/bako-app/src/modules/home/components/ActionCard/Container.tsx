import { Card } from '@bako-safe/ui/components';
import { CardProps, HStack } from '@chakra-ui/react';

interface ActionCardContainerProps extends CardProps {
  children: React.ReactNode;
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
