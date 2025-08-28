import { Flex, Icon, Image, Skeleton, Text, VStack } from '@chakra-ui/react';

import { LeftAndRightArrow } from '@/components';

interface SelectedCurrencyProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  imageUrl?: string;
  name?: string;
  isLoadingCurrencies?: boolean;
  balance?: string;
  symbol?: string;
}

export const SelectedCurrency = ({
  onClick,
  imageUrl,
  name,
  isLoadingCurrencies = false,
  balance,
  symbol,
}: SelectedCurrencyProps) => {
  return (
    <Skeleton minW="130px" minH="30px" isLoaded={!isLoadingCurrencies}>
      <VStack p={0} gap={0} align="end">
        <Flex
          alignItems="center"
          justifyContent="flex-end"
          gap={2}
          cursor="pointer"
          align="center"
          onClick={onClick}
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

          <Icon as={LeftAndRightArrow} color="grey.75" />
        </Flex>
        <Flex>
          <Text color="section.500" fontSize="12px">
            {`Balance: ${balance} ${symbol}`}
          </Text>
        </Flex>
      </VStack>
    </Skeleton>
  );
};
