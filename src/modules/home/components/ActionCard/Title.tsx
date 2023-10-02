import { Badge, Flex, Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface ActionCardTitleProps {
  children: ReactNode;
  isUpcoming?: boolean;
}

const Title = ({ children, isUpcoming }: ActionCardTitleProps) => {
  return (
    <Flex mb={3} alignItems="center">
      <Heading variant="title-xl" color="grey.200">
        {children}
      </Heading>
      {isUpcoming && (
        <Badge h="5" variant="warning" ml={3}>
          Upcoming
        </Badge>
      )}
    </Flex>
  );
};

export { Title };
