import { VStack, VStackProps } from 'bako-ui';

export const Root = ({ children, ...props }: VStackProps) => {
  return (
    <VStack
      as="ul"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '0px',
          height: '0px',
        },
        '&': {
          scrollbarWidth: 'none',
        },
        msOverflowStyle: 'none',
      }}
      {...props}
    >
      {children}
    </VStack>
  );
};
