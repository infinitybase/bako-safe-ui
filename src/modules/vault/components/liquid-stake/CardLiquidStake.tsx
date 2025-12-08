import { Box, Button, Card, Grid, HStack, Image, Text, VStack } from 'bako-ui';
import { Vault } from 'bakosafe';
import { useMemo, useState } from 'react';

import poweredByRig from '@/assets/svg/powered-by-rig.svg';
import { TooltipNotEnoughBalance } from '@/components';
import { Tooltip } from '@/components/ui/tooltip';
import { useGetTokenInfos, useScreenSize } from '@/modules/core';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { tokensIDS } from '@/modules/core/utils/assets/address';
import { useNetworks } from '@/modules/network/hooks';
import { availableNetWorks, NetworkType } from '@/modules/network/services';
import {
  ModalLiquidStake,
  ModalWithdrawalsLiquidStake,
} from '@/modules/vault/components';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import {
  useAPY,
  useDepositLiquidStake,
  useRig,
  useTotalFuelTokens,
  UseVaultDetailsReturn,
} from '../../hooks';
import BalanceHelperDrawer from '../BalanceHelperDrawer';
import BalanceHelperDialog from '../dialog/BalanceHelper';
import { TooltipPendingTx } from '../TooltipPendingTx';
import { ItemLiquidStake } from './ItemLiquidStake';
import { MobileDropdownLiquidStake } from './MobileDropdownLiquidStake';
export interface CardLiquidStakeProps {
  assets: UseVaultDetailsReturn['assets'];
  vault: Vault | undefined;
}

const WITHDRAW_URL = 'https://rig.st/';

export function CardLiquidStake({ assets, vault }: CardLiquidStakeProps) {
  const { isMobile } = useScreenSize();
  const rigContract = useRig(vault);
  const { assetsMap } = useWorkspaceContext();

  const { currentNetwork } = useNetworks();
  const { price, isPendingSigner } = useDepositLiquidStake();
  const { apyValue, isLoadingApy } = useAPY();
  const { totalFuelTokens, isLoadingFuelTokens } =
    useTotalFuelTokens(rigContract);

  const [isOpenMobileItem, setIsOpenMobileItem] = useState<boolean>(false);
  const [modal, setModal] = useState<'STAKE' | 'REDEEM' | ''>('');

  const handleOpenMobileItem = () => {
    if (isMobile) {
      setIsOpenMobileItem(true);
    }
  };

  const isMainnet = useMemo(() => {
    return currentNetwork.url === availableNetWorks[NetworkType.MAINNET].url;
  }, [currentNetwork]);

  const notEnoughBalanceETH = useMemo(() => {
    return assets.isEthBalanceLowerThanReservedAmount;
  }, [assets]);

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

  const handleOpenModal = (modal: 'STAKE' | 'REDEEM' | '' = '') => {
    setModal(modal);

    if (isMobile) {
      setIsOpenMobileItem(false);
    }
  };

  const handleCloseModal = () => {
    setModal('');
  };

  const { isOpen: isOpenErrorBalance, onOpenChange: onOpenChangeErrorBalance } =
    useDisclosure();

  const emptyEthOrFuel = useMemo(
    () => notEnoughBalanceETH || Number(fuelTokens) === 0,
    [fuelTokens, notEnoughBalanceETH],
  );

  const buttonStake = (
    <Button
      variant="subtle"
      size="sm"
      opacity={isMainnet ? 1 : 0.3}
      padding={'6px 8px 6px 8px'}
      borderRadius="lg"
      fontSize="xs"
      onClick={() => handleOpenModal('STAKE')}
      disabled={
        !isMainnet ||
        !assets.assets ||
        isPendingSigner ||
        notEnoughBalanceETH ||
        Number(fuelTokens) === 0
      }
    >
      Stake
    </Button>
  );

  const createItems = () => (
    <>
      <ItemLiquidStake
        label="FUEL Balance"
        value={fuelTokens}
        isLoading={!assets.assets}
      >
        <VStack alignItems={'flex-end'} gap={0}>
          {emptyEthOrFuel || isPendingSigner ? (
            <Tooltip
              content={
                isPendingSigner ? (
                  <TooltipPendingTx />
                ) : (
                  TooltipNotEnoughBalance({
                    asset: Number(fuelTokens) === 0 ? 'FUEL' : 'ETH',
                  })
                )
              }
              contentProps={{ bg: 'bg.muted', color: 'textPrimary' }}
              showArrow
              positioning={{ placement: 'top' }}
            >
              <Box display="inline-block" cursor="not-allowed">
                {buttonStake}
              </Box>
            </Tooltip>
          ) : (
            buttonStake
          )}
        </VStack>
      </ItemLiquidStake>

      <ItemLiquidStake
        label="stFUEL Balance"
        value={stFuelTokens}
        isLoading={!assets.assets}
      >
        <Button
          variant="subtle"
          opacity={isMainnet ? 1 : 0.3}
          size="sm"
          padding={'6px 8px 6px 8px'}
          borderRadius="lg"
          fontSize="xs"
          onClick={() => window.open(WITHDRAW_URL, '_blank')}
          disabled={!isMainnet || !assets.assets || Number(stFuelTokens) === 0}
        >
          Withdraw
        </Button>
      </ItemLiquidStake>
      <ItemLiquidStake
        label="Total FUEL"
        value={totalFuelTokens.toUpperCase()}
        isLoading={isLoadingFuelTokens}
      />
      <ItemLiquidStake
        label="APY"
        value={`${apyValue}%`}
        isLoading={isLoadingApy}
      />
    </>
  );

  return (
    <>
      <Card.Root
        borderRadius="2xl"
        bg="bg.panel"
        variant="subtle"
        flex={1}
        h="full"
      >
        <Card.Body>
          {isMobile ? (
            <BalanceHelperDrawer
              onOpenChange={onOpenChangeErrorBalance}
              open={isOpenErrorBalance}
            />
          ) : (
            <BalanceHelperDialog
              onOpenChange={onOpenChangeErrorBalance}
              open={isOpenErrorBalance}
            />
          )}

          <HStack
            marginBottom={{ base: 0, md: 4 }}
            onClick={handleOpenMobileItem}
          >
            <Text
              fontWeight={500}
              fontSize={isMobile ? 12 : 14}
              color="textPrimary"
            >
              Liquid Stake FUEL
            </Text>

            <HStack
              flex={1}
              alignItems="center"
              justifyContent="flex-end"
              display={{ base: 'none', md: 'flex' }}
            >
              <Image
                src={poweredByRig}
                alt="Powered by Rig"
                w="auto"
                maxH={8}
              />
            </HStack>

            {Number(stFuelTokens) > 0 ? (
              <Text
                flex={1}
                textAlign="right"
                fontSize={14}
                display={{ base: 'block', md: 'none' }}
              >
                {stFuelTokens}
                <br />
                <Text as="span" fontSize={12}>
                  stFUEL
                </Text>
              </Text>
            ) : (
              <Box
                flex={1}
                display={{ base: 'flex', md: 'none' }}
                justifyContent="flex-end"
              >
                <Button
                  variant="outline"
                  color="gray.50"
                  borderColor="gray.50"
                  fontSize={'12px'}
                  px="8px"
                  py="4px"
                  _hover={{ bg: 'gray.50/13' }}
                  onClick={() => handleOpenModal('STAKE')}
                  disabled={
                    !isMainnet ||
                    !assets.assets ||
                    isPendingSigner ||
                    notEnoughBalanceETH
                  }
                >
                  Start staking
                </Button>
              </Box>
            )}
          </HStack>
          <Grid
            templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
            gap={3}
            flex={1}
            display={{ base: 'none', md: 'grid' }}
          >
            {createItems()}
          </Grid>
        </Card.Body>
      </Card.Root>
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
        apyValue={apyValue}
        price={price}
        notEnoughBalanceETH={notEnoughBalanceETH}
        onClose={handleCloseModal}
      />
    </>
  );
}
