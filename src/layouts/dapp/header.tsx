import { Box, Heading, StackProps, Text, VStack } from '@chakra-ui/react';
import React from 'react';

interface HeaderProps extends StackProps {
  title: string;
  description: string;
}

const Header = ({ title, description, ...stackProps }: HeaderProps) => (
  <VStack w="full" mb={12} spacing={4} alignItems="flex-start" {...stackProps}>
    <Heading fontSize="2xl" color="grey.200">
      {title}
    </Heading>
    <Box maxW={345}>
      <Text variant="description">{description}</Text>
    </Box>
  </VStack>
);

export { Header };
