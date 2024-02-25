import { Box, Heading, StackProps, Text, VStack } from '@chakra-ui/react';

interface DialogHeaderProps extends StackProps {
  title: string;
  description: string;
  descriptionFontSize?: string;
}

const DialogHeader = ({
  title,
  description,
  descriptionFontSize,
  ...stackProps
}: DialogHeaderProps) => (
  <VStack w="full" mb={12} spacing={3} alignItems="flex-start" {...stackProps}>
    <Heading fontSize="2xl" color="grey.200">
      {title}
    </Heading>
    <Box maxW={500}>
      <Text fontSize={descriptionFontSize} variant="description">
        {description}
      </Text>
    </Box>
  </VStack>
);

export { DialogHeader };
