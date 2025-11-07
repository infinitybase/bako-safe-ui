import { Box, BoxProps } from 'bako-ui';

export interface CardProps extends BoxProps {}

const Card = (props: CardProps) => {
  const { children, ...rest } = props;

  return (
    <Box borderWidth={1} bg="gray.700" borderRadius={10} padding={6} {...rest}>
      {children}
    </Box>
  );
};

export { Card };
