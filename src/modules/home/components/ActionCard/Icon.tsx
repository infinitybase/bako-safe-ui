import { Box, Flex } from '@chakra-ui/react';

interface ActionCardIconProps {
  children: React.ReactNode;
}

const Icon = ({ children }: ActionCardIconProps) => {
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
        {children}
      </Box>
    </Flex>
  );
};

export { Icon };
