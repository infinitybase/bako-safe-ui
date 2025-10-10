import { Button, Card, Image, Stack, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import Empty from '@/assets/nft-empty.png';
import { GARAGE_APP_URL } from '@/utils/enviroment';

export const NFTsEmptyState = () => {
  return (
    <Card.Root
      w="full"
      p={{ base: 10, xs: 10 }}
      bg="gradients.transaction-card"
      borderWidth={1}
      borderColor="gradients.transaction-border"
      backdropFilter="blur(16px)"
      dropShadow="0px 8px 6px 0px #00000026"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      <VStack gap={8} py={{ md: 8, base: 4 }}>
        <Image
          src={Empty}
          alt="Empty nfts"
          w={{
            base: 'full',
            xs: '500px',
          }}
          height={{
            base: 'full',
            xs: '195px',
          }}
        />

        <Stack gap={2}>
          <Text textAlign="center" color="grey.50" fontSize="md">
            No items found
          </Text>
          <Text textAlign="center" color="grey.250" fontSize="xs">
            Discover new collection on Marketplace
          </Text>
        </Stack>

        <Button
          variant="primary"
          as={Link}
          to={GARAGE_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          size="lg"
          px={8}
        >
          Go to marketplace
        </Button>
      </VStack>
    </Card.Root>
  );
};
