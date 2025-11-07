import { Box, Flex, FlexProps, Icon, Text } from 'bako-ui';

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
    borderRadius="lg"
    bg="bg.muted"
    position="relative"
    {...rest}
  >
    {icon && <Icon boxSize="25px">{icon}</Icon>}
    <Box>
      <Text fontSize="sm" color="textSecondary">
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
