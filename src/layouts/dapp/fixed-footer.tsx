import { VStack, VStackProps } from 'bako-ui';
import React from 'react';

interface Props extends VStackProps {
  children: React.ReactNode;
}

export const FixedFooter = (props: Props) => {
  const { children, ...rest } = props;

  return (
    <VStack
      flexShrink={0}
      w="full"
      gap={6}
      p={6}
      borderTopRadius={16}
      bg="gray.600"
      {...rest}
    >
      {children}
    </VStack>
  );
};
