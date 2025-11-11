import { Avatar, Box, HStack, Separator, Text } from 'bako-ui';

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
      <Text>Requesting a transaction from:</Text>
      <Separator borderColor="dark.100" my={4} />
      <HStack alignItems="flex-start" gap={4}>
        <Avatar
          shape="rounded"
          bgColor="dark.150"
          color="white"
          name={title}
          src={faviconUrl}
        />
        <Box w="full">
          <Text>{title}</Text>
          <Text fontSize="sm" fontWeight="normal" color="brand.500">
            {origin}
          </Text>
        </Box>
      </HStack>
    </Card>
  );
};

export { DappConnectionDetail };
