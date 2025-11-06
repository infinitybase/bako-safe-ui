import { VStack, VStackProps } from 'bako-ui';

interface Props extends VStackProps { }

const ScrollableContent = ({ children, ...rest }: Props) => (
  <VStack
    flex={1}
    overflowY="auto"
    w="full"
    p={6}
    gap={6}
    css={{
      '&::-webkit-scrollbar': { width: '0' },
      scrollbarWidth: 'none',
    }}
    {...rest}
  >
    {children}
  </VStack>
);

export { ScrollableContent };
