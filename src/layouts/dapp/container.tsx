import { Box, BoxProps, Center } from '@chakra-ui/react';

export const DAPP_CONTAINER_SIZES = {
  width: 500,
  height: 750,
};

interface ContainerProps extends BoxProps {}

const Container = (props: ContainerProps) => {
  return (
    <Center alignItems="flex-start" bgColor="dark.400" w="100vw" h="100vh">
      <Box
        {...props}
        w="full"
        maxW={DAPP_CONTAINER_SIZES.width}
        maxH={DAPP_CONTAINER_SIZES.height}
      >
        {props.children}
      </Box>
    </Center>
  );
};

export { Container };
