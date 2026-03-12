import { Badge, Flex, Text } from 'bako-ui';
import { ReactNode } from 'react';

interface ActionCardTitleProps {
  children: ReactNode;
  isUpcoming?: boolean;
}

const Title = ({ children, isUpcoming }: ActionCardTitleProps) => {
  return (
    <Flex
      mb={1.5}
      alignItems={{ md: 'flex-start', lg: 'center' }}
      flexDir={{ md: 'column', lg: 'row' }}
    >
      <Text
        variant="subtitle"
        fontSize={{ base: 'md', sm: 'lg' }}
        fontWeight="semibold"
        color="grey.200"
      >
        {children}
      </Text>
      {isUpcoming && (
        <Badge h="5" variant="warning" ml={{ md: 0, lg: 3 }}>
          Upcoming
        </Badge>
      )}
    </Flex>
  );
};

export { Title };
