import { Flex, FlexProps } from '@chakra-ui/react';

export interface ContentProps extends FlexProps {}

const Content = (props: ContentProps) => {
  return (
    <Flex overflowY="scroll" height="calc(100vh - 82px)" flex={1} p={6}>
      {props.children}
    </Flex>
  );
};

export { Content };
