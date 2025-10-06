import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Dialog, MiraIcon, SwapStakeIcon, WalletStakeIcon } from '@/components';
import { useScreenSize } from '@/modules/core';

import { ItemWithdrawals } from './ItemWithdrawals';

const TITLE = 'Withdrawal';
const DESCRIPTION = (
  <span style={{ display: 'block', maxWidth: 'none', whiteSpace: 'normal' }}>
    Rig hasn’t enabled direct stFUEL withdrawals yet.
    <br />
    Until that option is live, you can swap stFUEL for FUEL through MICROCHAIN.
  </span>
);
const REDEEM_URL = 'https://www.microchain.systems/';

const ITENS = [
  {
    title: '1. Open Microchain',
    description: 'Connect your vault to access the stFUEL swap.',
    icon: <MiraIcon boxSize={70} borderRadius={8} />,
  },
  {
    title: '2. Swap stFUEL → FUEL',
    description: 'Select the pair and confirm the transaction.',
    icon: <SwapStakeIcon fontSize={70} borderRadius={8} />,
  },
  {
    title: '3. Receive FUEL',
    description: 'The FUEL will be credited in your vault within seconds.',
    icon: <WalletStakeIcon fontSize={70} borderRadius={8} />,
  },
];

interface ModalWithdrawalsLiquidStakeProps {
  isOpen?: boolean;
  onClose: () => void;
}

export function ModalWithdrawalsLiquidStake({
  isOpen = false,
  onClose,
}: ModalWithdrawalsLiquidStakeProps) {
  const { isMobile } = useScreenSize();

  if (isMobile) {
    return (
      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent padding={4}>
          <DrawerHeader>
            <VStack
              marginBottom={4}
              fontWeight="normal"
              alignItems="flex-start"
            >
              <Text fontSize={14} fontWeight={700}>
                {TITLE}
              </Text>
              <Text fontSize={12} color="grey.425">
                {DESCRIPTION}
              </Text>
            </VStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack>
              {ITENS.map(({ title, description, icon }, i) => (
                <ItemWithdrawals
                  key={`WithdrawalsLiquidStakeItem-${i}`}
                  title={title}
                  description={description}
                  iconItem={icon}
                />
              ))}
            </VStack>
            <Button
              variant="primary"
              width="full"
              onClick={() => (window.location.href = REDEEM_URL)}
            >
              Open Microchain
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog.Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      modalContentProps={{
        width: '798px',
        maxWidth: { base: 'full', md: '798px !important' },
      }}
    >
      <Dialog.Body>
        <Dialog.Header
          position={{ base: 'static', sm: 'relative' }}
          mb={0}
          title={TITLE}
          description={DESCRIPTION}
          descriptionColor={'grey.425'}
          mt={0}
          titleSxProps={{ fontSize: 16 }}
          onClose={onClose}
          sx={{
            '& div': { maxWidth: 'none !important' },
          }}
        />
        <HStack marginY={{ base: 10 }}>
          {ITENS.map(({ title, description, icon }, i) => (
            <ItemWithdrawals
              key={`WithdrawalsLiquidStakeItem-${i}`}
              title={title}
              description={description}
              iconItem={icon}
            />
          ))}
        </HStack>
        <Dialog.Actions hideDivider={true}>
          <Button
            variant="primary"
            width="full"
            onClick={() => window.open(REDEEM_URL, '_blank')}
          >
            Open Microchain
          </Button>
        </Dialog.Actions>
      </Dialog.Body>
    </Dialog.Modal>
  );
}
