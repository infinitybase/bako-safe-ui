import { Card, GridItem, HStack, Text, VStack } from 'bako-ui';

import { CustomSkeleton } from '@/components';
import { BlurredContent } from '@/components/blurredContent';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { limitCharacters } from '@/utils';

export interface ItemLiquidStakeProps {
  label: string;
  value: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  visibleBalance?: boolean;
}

export function ItemLiquidStake({
  label,
  value,
  children,
  isLoading = false,
  visibleBalance = false,
}: ItemLiquidStakeProps) {
  const {
    screenSizes: { isMobile, isLargerThan1600 },
  } = useWorkspaceContext();

  const charLimit = isLargerThan1600 || isMobile ? 20 : 13;

  return (
    <Card.Root
      as={GridItem}
      borderRadius="lg"
      flex={1}
      borderWidth={1}
      borderColor="gray.600"
      width="full"
      minW={value.length > 9 ? '190px' : '140px'}
    >
      <Card.Body padding={3}>
        <HStack flex={1} borderRadius={9}>
          <VStack flex={1} alignItems="flex-start" gap={0}>
            <Text fontSize="xs" color="textSecondary">
              {label}
            </Text>
            <CustomSkeleton loading={isLoading}>
              <BlurredContent isBlurred={visibleBalance} inline>
                <Text fontSize="xs" fontWeight={500} color="textPrimary">
                  {limitCharacters(value, charLimit)}
                </Text>
              </BlurredContent>
            </CustomSkeleton>
          </VStack>
          {children}
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}
