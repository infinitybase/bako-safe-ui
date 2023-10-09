import { Box, CardProps, Heading, Text, VStack } from '@chakra-ui/react';

import { Card } from '@/components';

interface ExtraVaultCardProps extends CardProps {
  extra: number;
}

export const ExtraVaultCard = ({ extra, ...rest }: ExtraVaultCardProps) => (
  <Card cursor="pointer" p={10} borderStyle="dashed" {...rest}>
    <VStack spacing={0}>
      <Box>
        <Box>
          <Heading variant="title-lg" color="grey.200">
            +{extra + 1}
          </Heading>
        </Box>
        <Heading variant="title-md" color="grey.200" my={1}>
          View all
        </Heading>
      </Box>

      <Text
        variant="description"
        textAlign="center"
        maxW={180}
        color="grey.500"
      >
        Expand Your Portfolio Connecting a New Assets.
      </Text>
    </VStack>
  </Card>
);
