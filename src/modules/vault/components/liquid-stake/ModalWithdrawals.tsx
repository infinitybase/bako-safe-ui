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

import { Dialog } from '@/components';
import { useScreenSize } from '@/modules/core';

import { ItemWithdrawals } from './ItemWithdrawals';

const TITLE = 'Withdrawal';
const DESCRIPTION = (
  <>
    Rig hasn’t enabled direct stFUEL withdrawals yet.
    <br />
    Until that option is live, you can swap stFUEL for FUEL through MIRA.
  </>
);

const ITENS = [
  {
    image: '/stake-withdrawals-1.png',
    title: '1. Open Mira',
    description: 'Connect your vault to access the stFUEL swap.',
  },
  {
    image: '/stake-withdrawals-2.png',
    title: '2. Swap stFUEL → FUEL',
    description: 'Select the pair and confirm the transaction.',
  },
  {
    image: '/stake-withdrawals-3.png',
    title: '3. Receive FUEL',
    description: 'The FUEL will be credited in your vault within seconds.',
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
              <Text fontSize={12} color="#868079">
                {DESCRIPTION}
              </Text>
            </VStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack>
              {ITENS.map(({ image, title, description }, i) => (
                <ItemWithdrawals
                  key={`WithdrawalsLiquidStakeItem-${i}`}
                  image={image}
                  title={title}
                  description={description}
                />
              ))}
            </VStack>
            <Button
              variant="primary"
              width="full"
              onClick={() => (window.location.href = 'https://mira.ly')}
            >
              Open MIRA
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
          descriptionColor={'#868079'}
          mt={0}
          titleSxProps={{ fontSize: 16 }}
          onClose={onClose}
        />
        <HStack marginY={{ base: 10 }}>
          {ITENS.map(({ image, title, description }, i) => (
            <ItemWithdrawals
              key={`WithdrawalsLiquidStakeItem-${i}`}
              image={image}
              title={title}
              description={description}
            />
          ))}
        </HStack>
        <Dialog.Actions hideDivider={true}>
          <Button
            variant="primary"
            width="full"
            onClick={() => window.open('https://mira.ly', '_blank')}
          >
            Open MIRA
          </Button>
        </Dialog.Actions>
      </Dialog.Body>
    </Dialog.Modal>
  );
}
