import { StackProps, Text, VStack } from '@chakra-ui/react';
import React from 'react';

export interface DialogSectionProps extends Omit<StackProps, 'title'> {
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
}

const DialogSection = ({
  title,
  description,
  children,
  ...stackProps
}: DialogSectionProps) => (
  <VStack spacing={1} alignItems="flex-start" {...stackProps}>
    {title}
    {description && (
      <Text w="90%" fontSize={{ base: 'sm', sm: 'md' }} variant="description">
        {description}
      </Text>
    )}
    {children}
  </VStack>
);

export { DialogSection };
