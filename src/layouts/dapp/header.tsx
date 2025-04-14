import {
  Alert,
  AlertIcon,
  Box,
  Heading,
  StackProps,
  Text,
  VStack,
} from '@chakra-ui/react';

interface HeaderProps extends StackProps {
  title: string;
  description: string;
  titleFontSize?: string;
  descriptionFontSize?: string;
}

const Header = ({
  title,
  description,
  titleFontSize,
  ...stackProps
}: HeaderProps) => (
  <VStack w="full" mb={12} spacing={4} alignItems="flex-start" {...stackProps}>
    <Heading fontSize={titleFontSize ? titleFontSize : '2xl'} color="grey.200">
      {title}
    </Heading>
    <Box w="full">
      <Alert
        status="info"
        variant="subtle"
        borderRadius="md"
        bg="#122431"
        color="blue.100"
        px={4}
        py={2}
        alignItems="center"
      >
        <AlertIcon color="#008ef4" />
        <Box>
          <Text fontSize="11.5px">{description}</Text>
        </Box>
      </Alert>
    </Box>
  </VStack>
);

export { Header };
