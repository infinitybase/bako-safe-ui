import { Flex, Icon, Image, Skeleton, Text, VStack } from 'bako-ui';
import { useCallback } from 'react';

import { LeftAndRightArrow } from '@/components';

interface SelectedCurrencyProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  imageUrl?: string;
  name?: string;
  isLoadingCurrencies?: boolean;
  balance?: string;
  symbol?: string;
  disabled?: boolean;
}

export const SelectedCurrency = ({
  onClick,
  imageUrl,
  name,
  isLoadingCurrencies = false,
  balance,
  symbol,
  disabled = false,
}: SelectedCurrencyProps) => {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (onClick) onClick(e);
    },
    [disabled, onClick],
  );

  return (
    <Skeleton minW="130px" minH="30px" loading={isLoadingCurrencies}>
      <VStack p={0} gap={0} align="end">
        <Flex
          alignItems="center"
          justifyContent="flex-end"
          gap={2}
          cursor="pointer"
          align="center"
          onClick={handleClick}
        >
          {!imageUrl && !name && (
            <Text color="section.200" fontSize="sm">
              Choose Asset
            </Text>
          )}
          {imageUrl && name && (
            <>
              <Image src={imageUrl} alt={name} boxSize="16px" rounded="lg" />

              <Text color="section.200" fontSize="sm">
                {name}
              </Text>
            </>
          )}

          <Icon as={LeftAndRightArrow} w={3} color="grey.75" />
        </Flex>
        {balance && symbol && (
          <Flex>
            <Text color="section.500" fontSize="12px">
              {`Balance: ${balance} ${symbol}`}
            </Text>
          </Flex>
        )}
      </VStack>
    </Skeleton>
  );
};
