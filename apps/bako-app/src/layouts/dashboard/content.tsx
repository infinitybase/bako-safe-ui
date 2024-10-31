import { Flex, FlexProps } from '@chakra-ui/react';

const Content = (props: FlexProps) => {
  return (
    <Flex
      overflowY="scroll"
      css={{ '&::-webkit-scrollbar': { width: '0' }, scrollbarWidth: 'none' }}
      minH="calc(100vh - 82px)"
      flex={1}
      py={{
        base: 3,
        sm: 6,
      }}
      px={{
        base: 3,
        sm: 6,
      }}
      maxW="1500px"
      mx="auto"
    >
      {props.children}
    </Flex>
  );
};

export { Content };
