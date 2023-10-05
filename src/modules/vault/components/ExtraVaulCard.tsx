import { Box, CardProps, Heading, Text, VStack } from '@chakra-ui/react';

import { Card } from '@/components';

interface ExtraVaultCardProps extends CardProps {
  extra: number;
  clickAction?: () => void;
}

export const ExtraVaultCard = ({
  extra,
  clickAction,
  ...rest
}: ExtraVaultCardProps) => (
  <Card
    cursor="pointer"
    onClick={clickAction}
    p={10}
    borderStyle="dashed"
    {...rest}
  >
    <VStack spacing={0}>
      <Box>
        <Box>
          <Heading variant="title-lg" color="grey.200">
            +{extra}
          </Heading>
        </Box>
        <Heading variant="title-md" color="grey.200">
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
