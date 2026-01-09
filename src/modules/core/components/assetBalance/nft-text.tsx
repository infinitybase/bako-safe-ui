import { Box, Flex, FlexProps, Icon, Text } from '@chakra-ui/react';

import { AssetIdWithCopy } from '@/components/address/assetIdWithCopy';

type NFTTextProps = {
  value: string;
  title: string;
  icon?: React.ReactNode;
  isCopy?: boolean;
} & FlexProps;

export const NFTText = ({
  value,
  title,
  icon,
  isCopy,
  ...rest
}: NFTTextProps) => (
  <Flex
    minW="fit-content"
    w="auto"
    p={2}
    gap={3}
    alignItems="center"
    borderRadius="md"
    bg="grey.925"
    position="relative"
    {...rest}
  >
    {icon && <Icon fontSize={25}>{icon}</Icon>}
    <Box>
      <Text fontSize="xs" color="section.500">
        {title}
      </Text>
      <Flex gap={2}>
        {isCopy ? (
          <AssetIdWithCopy assetId={value} />
        ) : (
          <Text fontSize="sm" color="white" wordBreak="break-word">
            {value}
          </Text>
        )}
      </Flex>
    </Box>
  </Flex>
);
