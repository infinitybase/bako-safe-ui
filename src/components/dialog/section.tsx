import { StackProps, Text, VStack } from '@chakra-ui/react';
import React from 'react';

export interface DialogSectionProps extends Omit<StackProps, 'title'> {
  title: React.ReactNode;
  description?: string;
}

const DialogSection = ({
  title,
  description,
  ...stackProps
}: DialogSectionProps) => (
  <VStack spacing={1} alignItems="flex-start" {...stackProps}>
    {title}
    {description && <Text variant="description">{description}</Text>}
  </VStack>
);

export { DialogSection };
