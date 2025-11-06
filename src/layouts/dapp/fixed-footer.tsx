import { VStack } from "bako-ui";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export const FixedFooter = ({ children }: Props) => {
  return (
    <VStack
      flexShrink={0}
      w="full"
      gap={6}
      p={6}
      borderTopRadius={16}
      bg="gray.600"
    >
      {children}
    </VStack>
  );
};