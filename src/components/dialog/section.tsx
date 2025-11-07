import { StackProps, Text, VStack } from 'bako-ui';
import React from 'react';

export interface DialogSectionProps extends Omit<StackProps, 'title'> {
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  descriptionFontSize?: string;
}

const DialogSection = ({
  title,
  description,
  children,
  descriptionFontSize,
  ...stackProps
}: DialogSectionProps) => (
  <VStack gap={1} alignItems="flex-start" {...stackProps}>
    {title}
    {description && (
      <Text w="90%" fontSize={{ base: 'sm', sm: descriptionFontSize ?? 'md' }}>
        {description}
      </Text>
    )}
    {children}
  </VStack>
);

export { DialogSection };
