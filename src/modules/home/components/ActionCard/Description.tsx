import { Box, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface ActionCardDescriptionProps {
  children: ReactNode;
}

const Description = ({ children }: ActionCardDescriptionProps) => {
  return (
    <Box>
      <Text variant="description">{children}</Text>
    </Box>
  );
};

export { Description };
