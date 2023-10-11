import { Badge, Flex, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface ActionCardTitleProps {
  children: ReactNode;
  isUpcoming?: boolean;
}

const Title = ({ children, isUpcoming }: ActionCardTitleProps) => {
  return (
    <Flex mb={1.5} alignItems="center">
      <Text
        variant="subtitle"
        fontSize="lg"
        fontWeight="semibold"
        color="grey.200"
      >
        {children}
      </Text>
      {isUpcoming && (
        <Badge h="5" variant="warning" ml={3}>
          Upcoming
        </Badge>
      )}
    </Flex>
  );
};

export { Title };
