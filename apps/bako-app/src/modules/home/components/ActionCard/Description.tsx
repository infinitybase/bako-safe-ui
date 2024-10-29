import { Box, Text } from '@chakra-ui/react';

interface ActionCardDescriptionProps {
  children: React.ReactNode;
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
