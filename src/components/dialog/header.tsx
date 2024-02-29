import { Box, Heading, StackProps, Text, VStack } from '@chakra-ui/react';

interface DialogHeaderProps extends StackProps {
  title: string;
  description: string;
}

const DialogHeader = ({
  title,
  description,
  ...stackProps
}: DialogHeaderProps) => (
  <VStack w="full" mb={12} spacing={3} alignItems="flex-start" {...stackProps}>
    <Heading fontSize="2xl" color="grey.200">
      {title}
    </Heading>
    <Box maxW={500}>
      <Text variant="description">{description}</Text>
    </Box>
  </VStack>
);

export { DialogHeader };
