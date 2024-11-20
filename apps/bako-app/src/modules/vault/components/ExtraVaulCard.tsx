import { Card } from '@bako-safe/ui';
import {
  Box,
  type CardProps,
  Divider,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';

interface ExtraVaultCardProps extends CardProps {
  extra: number;
}

export const ExtraVaultCard = ({ extra, ...rest }: ExtraVaultCardProps) => (
  <Card
    bg="gradients.transaction-card"
    borderWidth={1}
    borderColor="gradients.transaction-border"
    backdropFilter="blur(16px)"
    dropShadow="0px 8px 6px 0px #00000026"
    maxW="full"
    w="full"
    cursor="pointer"
    h="full"
    p={6}
    {...rest}
  >
    <VStack textAlign="center" spacing={0}>
      <Box>
        <Box>
          <Heading fontSize={{ base: '3xl', sm: '2xl' }} color="grey.200">
            +{extra + 1}
          </Heading>
        </Box>
        <Heading fontSize={{ base: 'xl', sm: '2xl' }} color="grey.200" my={1}>
          View all
        </Heading>
      </Box>

      <Divider borderColor="grey.600" mt={3} mb={4} />

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
