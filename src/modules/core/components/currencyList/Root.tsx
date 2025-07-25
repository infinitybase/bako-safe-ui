import { List, ListProps } from '@chakra-ui/react';

export const Root = ({ children, ...props }: ListProps) => {
  return (
    <List
      maxH={{
        base: 'full',
        sm: '300px',
      }}
      overflowY={{
        base: 'auto',
        sm: 'scroll',
      }}
      spacing={2}
      pr={1}
      sx={{
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
    </List>
  );
};
