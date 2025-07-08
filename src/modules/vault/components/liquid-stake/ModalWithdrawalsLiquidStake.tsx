import {
  Box,
  Button,
  HStack,
  Text,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  VStack,
  Image,
} from '@chakra-ui/react';

import { Dialog } from '@/components';
import { useScreenSize } from '@/modules/core';

const TITLE = 'Withdrawals';
const DESCRIPTION = `Rig hasn’t enabled direct stFUEL withdrawals yet. Until that option is live, you can swap stFUEL for FUEL through MIRA.`;
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

interface WithdrawalsLiquidStakeItemProps {
  image: string;
  title: string;
  description: string;
}

const WithdrawalsLiquidStakeItem = ({
  image,
  title,
  description,
}: WithdrawalsLiquidStakeItemProps) => (
  <Box
    width={{ base: 'full', md: 300 }}
    marginY={4}
    marginX={{ base: 4, md: 0 }}
    display="flex"
    flexDirection={{ base: 'row', md: 'column' }}
    justifyContent={{ base: 'flex-start', md: 'center' }}
    alignItems={{ base: 'flex-start', md: 'center' }}
  >
    <Image
      src={image}
      maxWidth={{ base: '48px', md: '80px' }}
      alt={title}
      borderRadius={8}
      marginBottom={{ base: 0, md: 12 }}
    />
    <Box display={{ base: 'row' }} marginLeft={{ base: 4, md: 0 }}>
      <Text
        fontSize={16}
        fontWeight={700}
        marginBottom={{ base: 0, md: 6 }}
        align={{ base: 'left', md: 'center' }}
      >
        {title}
      </Text>
      <Text
        fontWeight={{ base: 'normal', md: 600 }}
        fontSize={12}
        color={'#868079'}
        align={{ base: 'left', md: 'center' }}
      >
        {description}
      </Text>
    </Box>
  </Box>
);

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
                <WithdrawalsLiquidStakeItem
                  key={`WithdrawalsLiquidStakeItem-${i}`}
                  image={image}
                  title={title}
                  description={description}
                />
              ))}
            </VStack>
            <Button variant="primary" width="full">
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
          mt={0}
          titleSxProps={{ fontSize: 16 }}
          onClose={onClose}
        />
        <HStack marginY={{ base: 10 }}>
          {ITENS.map(({ image, title, description }, i) => (
            <WithdrawalsLiquidStakeItem
              key={`WithdrawalsLiquidStakeItem-${i}`}
              image={image}
              title={title}
              description={description}
            />
          ))}
        </HStack>
        <Dialog.Actions hideDivider={true}>
          <Button variant="primary" width="full">
            Open MIRA
          </Button>
        </Dialog.Actions>
      </Dialog.Body>
    </Dialog.Modal>
  );
}
