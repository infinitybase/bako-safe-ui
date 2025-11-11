import { Flex, FlexProps } from 'bako-ui';

export interface ContentProps extends FlexProps {}

const Content = (props: ContentProps) => {
  return (
    <Flex
      // overflowY="scroll"
      // css={{ '&::-webkit-scrollbar': { width: '0' }, scrollbarWidth: 'none' }}
      flex={1}
      py={{
        base: 3,
        sm: 0,
      }}
      px={{
        base: 3,
        sm: 6,
      }}
      maxW="1500px"
      mx="auto"
      {...props}
    >
      {props.children}
    </Flex>
  );
};

export { Content };
