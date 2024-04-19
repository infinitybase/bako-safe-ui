import { Box, Heading, StackProps, Text, VStack } from '@chakra-ui/react';

interface DialogHeaderProps extends StackProps {
  title: string;
  description?: string;
  descriptionFontSize?: string;
  descriptionColor?: string;
}

const DialogHeader = ({
  title,
  description,
  descriptionFontSize,
  descriptionColor,
  ...stackProps
}: DialogHeaderProps) => (
  <VStack
    w="full"
    mb={{ base: 6, sm: 12 }}
    spacing={3}
    alignItems="flex-start"
    {...stackProps}
  >
    <Heading fontSize={{ base: 'lg', sm: '3xl' }} color="white">
      {title}
    </Heading>
    <Box maxW={500} mb={{ base: 4, sm: 0 }}>
      {description && (
        <Text
          color={descriptionColor}
          fontSize={{ base: 'sm', sm: descriptionFontSize }}
          variant="description"
        >
          {description}
        </Text>
      )}
    </Box>
  </VStack>
);

export { DialogHeader };
