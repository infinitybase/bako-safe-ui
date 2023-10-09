import { Heading, StackProps, Text, VStack } from '@chakra-ui/react';
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
  <VStack spacing={4} alignItems="flex-start" {...stackProps}>
    <Heading fontSize="2xl" color="grey.200">
      {title}
    </Heading>
    <Text variant="description">{description}</Text>
  </VStack>
);

export { DialogHeader };
