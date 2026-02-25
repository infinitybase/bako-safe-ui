import { Box, Text } from 'bako-ui';
import { ReactNode } from 'react';

interface ActionCardDescriptionProps {
  children: ReactNode;
  maxWidth?: {
    [key: string]: number;
  };
}

const Description = ({ children, maxWidth }: ActionCardDescriptionProps) => {
  return (
    <Box maxW={maxWidth ?? { md: 180, lg: 300 }}>
      <Text variant="description" fontSize="sm">
        {children}
      </Text>
    </Box>
  );
};

export { Description };
