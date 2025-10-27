import {
  Avatar,
  HStack,
  Select,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useSelectContext,
} from 'bako-ui';
import { BN } from 'fuels';
import { memo } from 'react';

export const SelectedAsset = memo(
  ({
    onClick,
    isLoading,
    balance,
  }: {
    onClick: () => void;
    isLoading: boolean;
    balance: string;
  }) => {
    const select = useSelectContext();
    const items = select.selectedItems as {
      icon: string;
      label: string;
      value: string;
      balance?: BN;
      units?: number;
    }[];
    const icon = items?.[0]?.icon;
    const name = items?.[0]?.label;
    const units = items?.[0]?.units;

    const balanceWithoutRightZeros = Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      style: 'decimal',
      maximumFractionDigits: units,
    }).format(Number(balance));

    return (
      <Select.ValueText placeholder="Select asset" onClick={onClick} px={3}>
        <HStack alignItems="center" gap={2} h="40px">
          <SkeletonCircle loading={isLoading}>
            <Avatar src={icon} boxSize={5} />
          </SkeletonCircle>
          <Stack gap={0} overflow="hidden">
            {isLoading && (
              <>
                <Skeleton
                  width="70px"
                  height={3}
                  borderRadius="md"
                  variant="shine"
                />
                <Skeleton
                  width="60px"
                  mt={1}
                  height={3}
                  borderRadius="md"
                  variant="shine"
                />
              </>
            )}
            {!isLoading && (
              <>
                <Text
                  color="gray.50"
                  fontSize="xs"
                  lineHeight="shorter"
                  truncate
                >
                  {name}
                </Text>
                <Text
                  color="gray.400"
                  fontSize="xs"
                  lineHeight="shorter"
                  truncate
                  lineClamp={1}
                >
                  {balanceWithoutRightZeros}
                </Text>
              </>
            )}
          </Stack>
        </HStack>
      </Select.ValueText>
    );
  },
);

SelectedAsset.displayName = 'SelectedAsset';
