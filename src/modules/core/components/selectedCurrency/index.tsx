import { Flex, Icon, Image, Skeleton, Text } from '@chakra-ui/react';

import { LeftAndRightArrow } from '@/components';

interface SelectedCurrencyProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  imageUrl?: string;
  name?: string;
  isLoadingCurrencies?: boolean;
}

export const SelectedCurrency = ({
  onClick,
  imageUrl,
  name,
  isLoadingCurrencies = false,
}: SelectedCurrencyProps) => {
  return (
    <Skeleton minW="130px" minH="30px" isLoaded={!isLoadingCurrencies}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        cursor="pointer"
        onClick={onClick}
      >
        <Image
          src={imageUrl || '/nft-empty.svg'}
          alt={name}
          boxSize="16px"
          rounded="lg"
        />

        <Text color="section.200" fontSize="sm">
          {name}
        </Text>

        <Icon as={LeftAndRightArrow} color="grey.75" />
      </Flex>
    </Skeleton>
  );
};
