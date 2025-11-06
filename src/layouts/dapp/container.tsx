import { Flex, VStack, VStackProps } from 'bako-ui';

interface ContainerProps extends VStackProps { }

const Container = (props: ContainerProps) => {
  const { children, ...rest } = props;

  return (
    <Flex
      h="100vh"
      w="100vw"
      justify="center"
      align="stretch"
      overflowX="hidden"
    >
      <VStack
        h="full"
        w="full"
        maxW={500}
        minW={404}
        overflow="hidden"
        {...rest}
      >
        {children}
      </VStack>
    </Flex>
  );
};

export { Container };
