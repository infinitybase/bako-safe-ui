import { As, Box, Center, Flex, Icon as ChakraIcon } from '@chakra-ui/react';

interface ActionCardIconProps {
  icon: As;
  isUpcoming?: boolean;
}

const Icon = ({ icon, isUpcoming }: ActionCardIconProps) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      mr={3}
      position="relative"
    >
      <Box
        h="80px"
        w="80px"
        bg={isUpcoming ? 'grey.500' : 'brand.500'}
        opacity={isUpcoming ? '0.2' : '0.1'}
        borderRadius={10}
      />
      <Center position="absolute">
        <ChakraIcon
          fontSize={30}
          as={icon}
          color={isUpcoming ? 'grey.500' : 'brand.500'}
        />
      </Center>
    </Flex>
  );
};

export { Icon };
