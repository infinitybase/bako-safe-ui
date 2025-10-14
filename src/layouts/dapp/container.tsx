import { Box, BoxProps, Flex } from 'bako-ui';

export const DAPP_CONTAINER_SIZES = {
  width: 500,
  height: 750,
};

interface ContainerProps extends BoxProps {}

const Container = (props: ContainerProps) => {
  return (
    <Flex
      justifyContent="center"
      w="100vw"
      h="$100vh"
      overflowX="hidden"
      css={{
        '&::-webkit-scrollbar': { width: '0' },
        scrollbarWidth: 'none',
      }}
      bgColor="dark.950"
    >
      <Box
        maxW={DAPP_CONTAINER_SIZES.width}
        maxH={DAPP_CONTAINER_SIZES.height}
        {...props}
      >
        {props.children}
      </Box>
    </Flex>
  );
};

export { Container };
