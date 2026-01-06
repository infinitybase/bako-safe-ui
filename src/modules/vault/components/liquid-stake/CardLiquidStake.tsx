import {
  Box,
  Button,
  HStack,
  Icon,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Vault } from 'bakosafe';
import { useMemo, useState } from 'react';

import { FuelIcon, RigIcon, TooltipNotEnoughBalance } from '@/components';
import { useGetTokenInfos, useScreenSize } from '@/modules/core';
import { tokensIDS } from '@/modules/core/utils/assets/address';
import { useNetworks } from '@/modules/network/hooks';
import { availableNetWorks, NetworkType } from '@/modules/network/services';
import {
  ModalLiquidStake,
  ModalWithdrawalsLiquidStake,
} from '@/modules/vault/components';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

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
  const { totalFuelTokens, isLoadingFuelTokens, data } =
    useTotalFuelTokens(rigContract);
  const { apyValue } = useAPY(data?.rate);

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

  const { isOpen: isOpenErrorBalance, onClose: onCloseErrorBalance } =
    useDisclosure();

  const emptyEthOrFuel = useMemo(
    () => notEnoughBalanceETH || Number(fuelTokens) === 0,
    [fuelTokens, notEnoughBalanceETH],
  );

  const buttonStake = (
    <Button
      variant="secondaryV2"
      color="grey.75"
      size="sm"
      opacity={isMainnet ? 1 : 0.3}
      padding={'6px 8px 6px 8px'}
      borderRadius={'6px'}
      fontSize={12}
      onClick={() => handleOpenModal('STAKE')}
      isDisabled={
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
              label={
                isPendingSigner ? (
                  <TooltipPendingTx />
                ) : (
                  TooltipNotEnoughBalance({
                    asset: Number(fuelTokens) === 0 ? 'FUEL' : 'ETH',
                  })
                )
              }
              hasArrow
              placement="top"
              bg="dark.700"
              color="white"
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
          variant="secondaryV2"
          color="grey.75"
          opacity={isMainnet ? 1 : 0.3}
          size="sm"
          padding={'6px 8px 6px 8px'}
          borderRadius={'6px'}
          fontSize={12}
          onClick={() => window.open(WITHDRAW_URL, '_blank')}
          isDisabled={
            !isMainnet || !assets.assets || Number(stFuelTokens) === 0
          }
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
        isLoading={isLoadingFuelTokens}
      />
    </>
  );

  return (
    <>
      <Box
        maxW="full"
        marginBottom={9}
        borderRadius={9}
        height={{ base: '70px', sm: 16, md: 36 }}
        padding={{ base: 3, md: 4 }}
        backgroundImage={'/bg-stake-card.png'}
        backgroundSize="cover"
        alignContent={{ base: 'center', md: 'flex-start' }}
      >
        {isMobile ? (
          <BalanceHelperDrawer
            onClose={onCloseErrorBalance}
            isOpen={isOpenErrorBalance}
          />
        ) : (
          <BalanceHelperDialog
            onClose={onCloseErrorBalance}
            isOpen={isOpenErrorBalance}
          />
        )}

        <HStack
          marginBottom={{ base: 0, md: 4 }}
          height={{ base: 'none', md: 'flex' }}
          onClick={handleOpenMobileItem}
        >
          <Icon as={FuelIcon} fontSize={{ base: 32, md: 33 }} />

          <Text fontWeight={500} fontSize={isMobile ? 12 : 14}>
            Liquid Stake FUEL
          </Text>

          <HStack
            flex={1}
            justifyContent="flex-end"
            alignItems="center"
            display={{ base: 'none', md: 'flex' }}
          >
            <Text fontSize={10}>powered by</Text>
            <RigIcon fontSize={32} />
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
                color="grey.75"
                borderColor="grey.75"
                fontSize={'12px'}
                px="8px"
                py="4px"
                _hover={{ bg: '#f5f5f513' }}
                onClick={() => handleOpenModal('STAKE')}
                isDisabled={
                  !isMainnet ||
                  !assets.assets ||
                  isPendingSigner ||
                  notEnoughBalanceETH
                }
              >
                {'Start staking'}
              </Button>
            </Box>
          )}
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
        apyValue={apyValue}
        price={price}
        notEnoughBalanceETH={notEnoughBalanceETH}
        onClose={handleCloseModal}
      />
    </>
  );
}
