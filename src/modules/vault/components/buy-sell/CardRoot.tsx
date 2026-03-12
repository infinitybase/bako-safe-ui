import { Card, CardBodyProps } from 'bako-ui';

export const CardRoot = ({ children, ...rest }: CardBodyProps) => {
  return (
    <Card.Root variant="outline">
      <Card.Body
        gap={2}
        display="flex"
        flexDirection="column"
        padding={3}
        {...rest}
      >
        {children}
      </Card.Body>
    </Card.Root>
  );
};
