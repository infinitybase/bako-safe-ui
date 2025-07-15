import { Box, Button, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';

import { FuelIcon, RigIcon } from '@/components';
import { useGetTokenInfos, useScreenSize } from '@/modules/core';
import { tokensIDS } from '@/modules/core/utils/assets/address';
import {
  ModalLiquidStake,
  ModalWithdrawalsLiquidStake,
} from '@/modules/vault/components';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { UseVaultDetailsReturn } from '../../hooks';
import { ItemLiquidStake } from './ItemLiquidStake';
import { MobileDropdownLiquidStake } from './MobileDropdownLiquidStake';
export interface CardLiquidStakeProps {
  assets: UseVaultDetailsReturn['assets'];
}

export function CardLiquidStake({ assets }: CardLiquidStakeProps) {
  const { isMobile } = useScreenSize();
  const { assetsMap } = useWorkspaceContext();

  const [isOpenMobileItem, setIsOpenMobileItem] = useState<boolean>(false);
  const [modal, setModal] = useState<'STAKE' | 'REDEEM' | ''>('');

  const handleOpenMobileItem = () => {
    if (isMobile) {
      setIsOpenMobileItem(true);
    }
  };

  const assetFuel = useMemo(() => {
    return assets.assets?.find((a) => a.assetId === tokensIDS.FUEL);
  }, [assets]);

  const assetStFuel = useMemo(() => {
    return assets.assets?.find((a) => a.assetId === tokensIDS.stFUEL);
  }, [assets]);

  const { assetAmount: fuelTokens } = useGetTokenInfos({
    assetId: assetFuel?.assetId ?? '',
    amount: assetFuel?.amount,
    assetsMap,
  });
  const { assetAmount: stFuelTokens } = useGetTokenInfos({
    assetId: assetStFuel?.assetId ?? '',
    amount: assetStFuel?.amount,
    assetsMap,
  });

  const handleOpenModal =
    (modal: 'STAKE' | 'REDEEM' | '' = '') =>
    () => {
      setModal(modal);

      if (isMobile) {
        setIsOpenMobileItem(false);
      }
    };

  const handleCloseModal = () => {
    setModal('');
  };

  const createItems = () => (
    <>
      <ItemLiquidStake label="FUEL Balance" value={fuelTokens}>
        <Button
          variant="secondaryV2"
          color="grey.75"
          size="sm"
          padding={'6px 8px 6px 8px'}
          borderRadius={'6px'}
          fontSize={12}
          onClick={handleOpenModal('STAKE')}
        >
          Stake
        </Button>
      </ItemLiquidStake>
      <ItemLiquidStake label="stFuel Balance" value={stFuelTokens}>
        <Button
          variant="secondaryV2"
          color="grey.75"
          size="sm"
          padding={'6px 8px 6px 8px'}
          borderRadius={'6px'}
          fontSize={12}
          onClick={handleOpenModal('REDEEM')}
        >
          Redeem
        </Button>
      </ItemLiquidStake>
      <ItemLiquidStake label="Total Fuel" value="245 Mi" />
      <ItemLiquidStake label="APY%" value="24.07%" />
    </>
  );

  return (
    <>
      <Box
        maxW="full"
        marginBottom={9}
        borderRadius={9}
        height={{ base: 16, md: 36 }}
        padding={{ base: 3, md: 4 }}
        backgroundImage={{
          base: '/bg-stake-mobile.png',
          md: '/bg-stake-desktop.png',
        }}
        backgroundSize="cover"
        alignContent={{ base: 'center', md: 'flex-start' }}
      >
        <HStack
          marginBottom={{ base: 0, md: 4 }}
          onClick={handleOpenMobileItem}
        >
          <Icon as={FuelIcon} fontSize={{ base: 32, md: 33 }} />
          <VStack alignItems="flex-start" gap={0}>
            <Text fontSize={isMobile ? 12 : 14}>Auto Stake $FUEL</Text>
            <Text fontSize={isMobile ? 10 : 12} color={'gray.400'}>
              Earn Up to 18% More than Manual Staking
            </Text>
          </VStack>
          <HStack
            flex={1}
            justifyContent="flex-end"
            alignItems="center"
            display={{ base: 'none', md: 'flex' }}
          >
            <Text fontSize={10}>powered by</Text>
            <RigIcon fontSize={32} />
          </HStack>
          <Text
            flex={1}
            textAlign="right"
            fontSize={14}
            display={{ base: 'block', md: 'none' }}
          >
            {stFuelTokens}
            <br />
            <Text as="span" fontSize={12}>
              in staking
            </Text>
          </Text>
        </HStack>
        <HStack
          justifyContent="space-between"
          gap={6}
          display={{ base: 'none', md: 'flex' }}
        >
          {createItems()}
        </HStack>
      </Box>
      <MobileDropdownLiquidStake
        onClose={() => {
          setIsOpenMobileItem(false);
        }}
        isOpen={isOpenMobileItem}
      >
        {createItems()}
      </MobileDropdownLiquidStake>
      <ModalWithdrawalsLiquidStake
        isOpen={modal === 'REDEEM'}
        onClose={handleCloseModal}
      />
      <ModalLiquidStake
        isOpen={modal === 'STAKE'}
        balance={fuelTokens}
        onClose={handleCloseModal}
        asset={assetStFuel}
        assetsMap={assetsMap}
      />
    </>
  );
}
