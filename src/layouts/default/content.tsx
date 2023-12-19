import { Flex, FlexProps } from '@chakra-ui/react';

export interface ContentProps extends FlexProps {}

const Content = ({ children, ...props }: ContentProps) => {
  return (
    <Flex width="100%" justifyContent="center" mt={20} {...props}>
      {children}
    </Flex>
  );
};

export { Content };
