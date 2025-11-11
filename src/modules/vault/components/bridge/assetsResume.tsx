import { Avatar, Box, Flex, Float, HStack, Stack, Text } from 'bako-ui';

import { DoubleArrowIcon } from '@/components';

import { AssetItem } from './modalSelectNetwork';
import { AssetFormItem } from './providers/FormBridgeProvider';

interface AssetsResumeProps {
  toAsset: AssetItem;
  toNetwork: AssetFormItem | null;
  fromAsset: AssetItem;
}

export const AssetsResume = ({
  toAsset,
  toNetwork,
  fromAsset,
}: AssetsResumeProps) => {
  return (
    <HStack
      w="full"
      justifyContent="space-between"
      border="1px solid"
      borderColor="bg.muted"
      p={3}
      rounded="md"
      mb={3}
    >
      <Flex gap={3} alignItems="center">
        <Box position="relative">
          <Avatar boxSize="20px" src={fromAsset.image} />
          <Float placement="bottom-end" offsetX="1" offsetY="1">
            <Avatar
              border="1px solid"
              borderColor="bg.panel"
              boxSize="14px"
              src="https://verified-assets.fuel.network/images/fuel.svg"
            />
          </Float>
        </Box>
        <Stack gap={0.5}>
          <Text
            color="textPrimary"
            fontSize="xs"
            fontWeight="medium"
            lineHeight="shorter"
          >
            {fromAsset.name}
          </Text>
          <Text color="gray.400" fontSize="xs" lineHeight="shorter">
            Fuel Ignition
          </Text>
        </Stack>
      </Flex>
      <Flex alignItems="center">
        <DoubleArrowIcon boxSize="16px" />
      </Flex>

      <Flex gap={3} alignItems="center" justifyContent="flex-end">
        <Stack gap={0.5}>
          <Text
            color="textPrimary"
            fontSize="xs"
            fontWeight="medium"
            lineHeight="shorter"
          >
            {toAsset.name}
          </Text>
          <Text color="gray.400" fontSize="xs" lineHeight="shorter">
            {toNetwork?.name}
          </Text>
        </Stack>
        <Box position="relative">
          <Avatar boxSize="20px" src={toAsset.image} />
          <Float placement="bottom-end" offsetX="1" offsetY="1">
            <Avatar
              border="1px solid"
              borderColor="bg.panel"
              boxSize="14px"
              src={toNetwork?.image}
            />
          </Float>
        </Box>
      </Flex>
    </HStack>
  );
};
