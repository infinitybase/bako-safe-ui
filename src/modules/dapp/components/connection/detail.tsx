import { Avatar, Box, Divider, HStack, Text } from '@chakra-ui/react';

import { Card } from '@/components';

export interface DappConnectionDetailProps {
  title: string;
  origin: string;
  faviconUrl?: string;
}

const DappConnectionDetail = ({
  origin,
  faviconUrl,
  title,
}: DappConnectionDetailProps) => {
  return (
    <Card py={4}>
      <Text variant="description">Requesting a transaction from:</Text>
      <Divider borderColor="dark.100" my={4} />
      <HStack alignItems="flex-start" spacing={4}>
        <Avatar
          variant="roundedSquare"
          bgColor="dark.150"
          color="white"
          name={title}
          src={faviconUrl}
        />
        <Box w="full">
          <Text variant="subtitle">{title}</Text>
          <Text fontSize="sm" fontWeight="normal" color="brand.500">
            {origin}
          </Text>
        </Box>
      </HStack>
    </Card>
  );
};

export { DappConnectionDetail };
