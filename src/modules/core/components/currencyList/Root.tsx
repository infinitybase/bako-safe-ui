import { ListRoot, ListRootProps } from '@chakra-ui/react';

export const Root = ({ children, ...props }: ListRootProps) => {
  return (
    <ListRoot
      maxH={{
        base: 'full',
        sm: '300px',
      }}
      overflowY={{
        base: 'auto',
        sm: 'scroll',
      }}
      gap={2}
      pr={1}
      css={{
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'grey.300',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
      }}
      {...props}
    >
      {children}
    </ListRoot>
  );
};
