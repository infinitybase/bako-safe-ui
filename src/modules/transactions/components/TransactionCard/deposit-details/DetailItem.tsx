import { AddressUtils, AssetModel, useScreenSize } from '@/modules/core';
import TokenInfos from './TokenInfos';
import { Box, Center, Grid, Icon, Text } from '@chakra-ui/react';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { ITransferAsset } from 'bakosafe';
import AmountsInfo from './AmountsInfo';
import { limitCharacters } from '@/utils';
import { Address } from 'fuels';
import { DoubleArrowIcon } from '@/components';

interface DetailItemProps {
  asset: AssetModel;
}

const DetailItem = ({ asset }: DetailItemProps) => {
  const txUSDAmount = useTxAmountToUSD([asset as ITransferAsset]);
  const { isExtraSmall } = useScreenSize();

  return (
    <Grid gridTemplateColumns="repeat(5,1fr)" alignItems="center">
      <TokenInfos asset={asset} />
      <AmountsInfo txUSDAmount={txUSDAmount} asset={asset} />
      <Text
        maxW="288px"
        w="full"
        fontSize="sm"
        color="grey.75"
        textOverflow="ellipsis"
        isTruncated
      >
        {/* {asset.to} */}
        {isExtraSmall
          ? limitCharacters(
              AddressUtils.format(
                Address.fromString(asset.to ?? '').toAddress(),
              ) ?? '',
              7,
            )
          : AddressUtils.format(
              Address.fromString(asset.to ?? '').toAddress(),
              24,
            )}
      </Text>

      <Box display="flex" justifyContent="center">
        <Center
          borderRadius={5}
          bgColor="grey.825"
          borderWidth={1}
          borderColor="grey.925"
          boxSize="30px"
        >
          <Icon color="grey.250" fontSize="18px" as={DoubleArrowIcon} />
        </Center>
      </Box>

      <Text
        maxW="288px"
        w="full"
        fontSize="sm"
        color="grey.75"
        textOverflow="ellipsis"
        isTruncated
      >
        {/* {asset.to} */}
        {isExtraSmall
          ? limitCharacters(
              AddressUtils.format(
                Address.fromString(asset.to ?? '').toAddress(),
              ) ?? '',
              7,
            )
          : AddressUtils.format(
              Address.fromString(asset.to ?? '').toAddress(),
              24,
            )}
      </Text>
    </Grid>
  );
};
export default DetailItem;
