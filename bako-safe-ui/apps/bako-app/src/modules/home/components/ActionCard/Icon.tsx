import { As, Box, Flex, Icon as ChakraIcon } from '@chakra-ui/react';

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
      borderRadius={10}
      border={'2px solid transparent'}
      borderColor="rgba(255, 192, 16, 0.6)"
    >
      <Box backgroundColor="rgba(255, 192, 16, 0.1)" borderRadius={8} p={5}>
        <ChakraIcon
          fontSize={30}
          as={icon}
          color={isUpcoming ? 'grey.500' : 'brand.500'}
        />
      </Box>
    </Flex>
  );
};

export { Icon };
