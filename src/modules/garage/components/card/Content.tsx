import { Stack, type StackProps } from '@chakra-ui/react';

export const Content = ({ ...props }: StackProps) => {
  return <Stack p={2} {...props} />;
};
