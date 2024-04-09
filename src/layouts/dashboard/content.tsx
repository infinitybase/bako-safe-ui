import { Flex, FlexProps } from '@chakra-ui/react';

export interface ContentProps extends FlexProps {}

const Content = (props: ContentProps) => {
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
        base: 5,
        sm: 6,
      }}
    >
      {props.children}
    </Flex>
  );
};

export { Content };
