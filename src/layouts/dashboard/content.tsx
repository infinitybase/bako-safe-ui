import { Flex, FlexProps } from '@chakra-ui/react';

export interface ContentProps extends FlexProps {}

const Content = (props: ContentProps) => {
  return (
    <Flex
      overflowY="scroll"
      css={{ '&::-webkit-scrollbar': { width: '0' }, scrollbarWidth: 'none' }}
      minH="calc(100vh - 72px)"
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
