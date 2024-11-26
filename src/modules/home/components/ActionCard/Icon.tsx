import { As, Flex, Icon as ChakraIcon } from '@chakra-ui/react';

interface ActionCardIconProps {
  icon: As;
  isUpcoming?: boolean;
}

const Icon = ({ icon, isUpcoming }: ActionCardIconProps) => {
  return (
    <Flex
      w={'44px'}
      h={'44px'}
      minW={'44px'}
      minH={'44px'}
      alignItems="center"
      justifyContent="center"
      mr={3}
      borderRadius={10}
      border={'2px solid transparent'}
      borderColor="rgba(255, 192, 16, 0.6)"
    >
      <ChakraIcon
        fontSize={30}
        as={icon}
        color={isUpcoming ? 'grey.500' : 'brand.500'}
      />
    </Flex>
  );
};

export { Icon };
