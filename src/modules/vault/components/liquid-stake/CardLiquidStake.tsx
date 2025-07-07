import {
  Box,
  Button,
  Card,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { FuelIcon, RigIcon } from '@/components';
import { useScreenSize } from '@/modules/core';
import { ModalLiquidStake, ModalWithdrawalsLiquidStake } from '@/modules/vault/components';

export interface ItemLiquidStakeProps {
  label: string;
  value: string;
  children?: React.ReactNode;
}

const ItemLiquidStake = ({ label, value, children }: ItemLiquidStakeProps) => {
  return (
    <Card
      flexDirection="row"
      borderRadius={9}
      flex={1}
      alignItems="center"
      background={'var(--chakra-colors-dark-950)'}
      width="full"
    >
      <HStack
        flex={1}
        padding={3}
        background={'var(--chakra-colors-gradients-transaction-card)'}
      >
        <VStack flex={1} alignItems="flex-start" gap={0}>
          <Text fontSize={12} color={'gray'}>
            {label}
          </Text>
          <Text fontSize={16} fontWeight={700} color="white">
            {value}
          </Text>
        </VStack>
        {children}
      </HStack>
    </Card>
  );
};

interface MobileItemLiquidStakeProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const MobileItemLiquidStake = ({
  isOpen,
  onClose,
  children,
}: MobileItemLiquidStakeProps) => {
  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent padding={4}>
        <DrawerHeader>
          <HStack marginBottom={4} fontWeight="normal">
            <Icon as={FuelIcon} fontSize={24} />
            <Text fontSize={14}>Liquid Stake FUEL</Text>
            <HStack
              flex={1}
              justifyContent="flex-end"
              alignItems="center"
              display={{ base: 'flex', md: 'none' }}
            >
              <Text fontSize={10}>powered by</Text>
              <RigIcon fontSize={32} />
            </HStack>
          </HStack>
        </DrawerHeader>
        <DrawerBody>
          <VStack alignItems="flex-start">{children}</VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export function CardLiquidStake() {
  const { isMobile } = useScreenSize();

  const [isOpenMobileItem, setIsOpenMobileItem] = useState<boolean>(false);

  const handleOpenMobileItem = () => {
    if (isMobile) {
      setIsOpenMobileItem(true);
    }
  };

  const createItems = () => (
    <>
      <ItemLiquidStake label="FUEL Balance" value="1,587.56124">
        <Button variant="primary" size="sm" fontSize={12}>
          Stake
        </Button>
      </ItemLiquidStake>
      <ItemLiquidStake label="FUEL in staking" value="114,565.49783">
        <Button variant={'secondary'} size="sm" fontSize={12}>
          Redeem
        </Button>
      </ItemLiquidStake>
      <ItemLiquidStake label="Total FUEL earned" value="2,159.45" />
      <ItemLiquidStake label="Total value staked" value="0.0000" />
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
          <Text fontSize={14}>Liquid Stake FUEL</Text>
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
            114,565.49783
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
      <MobileItemLiquidStake
        onClose={() => {
          setIsOpenMobileItem(false);
        }}
        isOpen={isOpenMobileItem}
      >
        {createItems()}
      </MobileItemLiquidStake>
      <ModalWithdrawalsLiquidStake />
      <ModalLiquidStake />
    </>
  );
}
