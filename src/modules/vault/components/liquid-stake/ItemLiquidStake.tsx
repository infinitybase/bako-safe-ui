import { Card, GridItem, HStack, Text, Tooltip, VStack } from 'bako-ui';

import { CustomSkeleton } from '@/components';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { limitCharacters } from '@/utils';

export interface ItemLiquidStakeProps {
  label: string;
  value: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  tooltipValue?: boolean;
}

export function ItemLiquidStake({
  label,
  value,
  children,
  isLoading = false,
  tooltipValue = false,
}: ItemLiquidStakeProps) {
  const {
    screenSizes: { isMobile, isLargerThan1600 },
  } = useWorkspaceContext();

  const charLimit = isLargerThan1600 || isMobile ? 6 : 6;

  return (
    <Card.Root
      as={GridItem}
      borderRadius="lg"
      flex={1}
      borderWidth={1}
      borderColor="gray.600"
      width="full"
      minW="0"
    >
      <Card.Body padding={3}>
        <HStack flex={1} borderRadius={9}>
          <VStack flex={1} minW="0" alignItems="flex-start" gap={0}>
            <Text fontSize="xs" color="textSecondary">
              {label}
            </Text>
            <CustomSkeleton loading={isLoading}>
              <Tooltip content={value} disabled={!tooltipValue}>
                <Text
                  fontSize="xs"
                  fontWeight={500}
                  color="textPrimary"
                  overflow="hidden"
                >
                  {limitCharacters(value, charLimit, false)}
                </Text>
              </Tooltip>
            </CustomSkeleton>
          </VStack>
          {children}
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}
