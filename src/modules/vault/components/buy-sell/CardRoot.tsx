import { Card, CardBody, CardBodyProps } from '@chakra-ui/react';

export const CardRoot = ({ children, ...rest }: CardBodyProps) => {
  return (
    <Card variant="outline">
      <CardBody
        gap={2}
        display="flex"
        flexDirection="column"
        padding={3}
        {...rest}
      >
        {children}
      </CardBody>
    </Card>
  );
};
