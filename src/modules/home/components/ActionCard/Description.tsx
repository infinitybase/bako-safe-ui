import { Box, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface ActionCardDescriptionProps {
  children: ReactNode;
}

const Description = ({ children }: ActionCardDescriptionProps) => {
  return (
    <Box maxW={{ md: 180, lg: 300 }}>
      <Text variant="description">{children}</Text>
    </Box>
  );
};

export { Description };
