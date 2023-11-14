import { Box, BoxProps, Center } from '@chakra-ui/react';

export const DAPP_CONTAINER_SIZES = {
  width: 400,
  height: 600,
};

interface ContainerProps extends BoxProps {}

const Container = (props: ContainerProps) => {
  return (
    <Center w="100vw" h="100vh">
      <Box
        {...props}
        maxW={DAPP_CONTAINER_SIZES.width}
        maxH={DAPP_CONTAINER_SIZES.height}
      >
        {props.children}
      </Box>
    </Center>
  );
};

export { Container };
