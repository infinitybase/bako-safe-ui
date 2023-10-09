import { Box, Heading, StackProps, Text, VStack } from '@chakra-ui/react';
import React from 'react';

interface DialogHeaderProps extends StackProps {
  title: string;
  description: string;
}

const DialogHeader = ({
  title,
  description,
  ...stackProps
}: DialogHeaderProps) => (
  <VStack w="full" mb={12} spacing={4} alignItems="flex-start" {...stackProps}>
    <Heading fontSize="2xl" color="grey.200">
      {title}
    </Heading>
    <Box maxW={305}>
      <Text variant="description">{description}</Text>
    </Box>
  </VStack>
);

export { DialogHeader };
