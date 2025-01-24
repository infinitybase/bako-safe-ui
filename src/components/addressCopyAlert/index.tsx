import React from 'react';
import { Alert, Box, Checkbox, Heading, Text, VStack } from '@chakra-ui/react';
import { Dialog } from '@/components/dialog';
import { WarningIcon } from '@/components/icons';
import { Address } from 'fuels';

export interface AddressCopyAlertProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  address: string;
}

const ALERT_STEPS = {
  CHECK_BOX: 'CHECK_BOX',
  CONFIRM: 'CONFIRM',
};

const AddressCopyAlert = ({
  isOpen,
  setIsOpen,
  address,
}: AddressCopyAlertProps) => {
  const [alertChecked, setAlertChecked] = React.useState(false);
  const [alertStep, setAlertStep] = React.useState(ALERT_STEPS.CHECK_BOX);

  const onClose = () => {
    setAlertStep(ALERT_STEPS.CHECK_BOX);
    setAlertChecked(false);
    setIsOpen(false);
  };

  const check_box = () => {
    return (
      <>
        <Dialog.Body
          w="full"
          maxW={500}
          h="400px"
          display="flex"
          alignItems="center"
          px={4}
          mb="18px"
          mt={{ base: 40, sm: '2px' }}
        >
          <VStack w="full" spacing={8}>
            <WarningIcon w={24} h={24} />

            <VStack spacing={6}>
              <Heading fontSize="xl" color="grey.75">
                {'address copied!'}
              </Heading>
              <Text
                variant="description"
                color="grey.250"
                fontSize="xs"
                textAlign="center"
              >
                {
                  'For signing purposes only! DO NOT send any assets to this address.'
                }
              </Text>
              <Checkbox
                isChecked={alertChecked}
                onChange={(e) => setAlertChecked(e.target.checked)}
                size="lg"
                colorScheme="orange"
                spacing={3}
              >
                <Text fontSize="sm" color="grey.200">
                  I understand that I should not use this address to receive
                  assets.
                </Text>
              </Checkbox>
            </VStack>
          </VStack>
        </Dialog.Body>
        <Dialog.Actions
          w="full"
          maxW={385}
          dividerBorderColor="grey.425"
          position="relative"
          hideDivider
          px={2}
          mb={4}
        >
          <Dialog.PrimaryAction
            flex={3}
            // variant="outline"
            variant={alertChecked ? 'primary' : 'outline'}
            color={alertChecked ? '#121212' : 'grey.75'}
            cursor={alertChecked ? 'pointer' : 'default'}
            onClick={() => {
              if (!alertChecked) return;
              setAlertStep(ALERT_STEPS.CONFIRM);
            }}
            _hover={{
              opacity: 0.8,
            }}
          >
            Show address
          </Dialog.PrimaryAction>
        </Dialog.Actions>
      </>
    );
  };

  const confirm = () => {
    return (
      <>
        <Dialog.Body
          w="full"
          maxW={385}
          h="400px"
          display="flex"
          alignItems="center"
          px={4}
          mb="18px"
          mt={{ base: 40, sm: '2px' }}
        >
          <VStack w="full" spacing={8}>
            <WarningIcon w={24} h={24} />

            <VStack spacing={6}>
              <Heading fontSize="xl" color="grey.75">
                {'address'}
              </Heading>

              <Text
                variant="description"
                color="grey.250"
                fontSize="xs"
                textAlign="center"
                wordBreak="break-word"
              >
                {address}
              </Text>
              <Alert
                px={6}
                py={4}
                bgColor="#FDD8351A"
                borderWidth={1}
                borderRadius={8}
                borderColor="#FDD8351A"
                my={2}
                top="30px"
              >
                <Box w="full" ml={4}>
                  <Text variant="subtitle" color="#FDD835">
                    Attention!
                  </Text>
                  <Text fontSize="xs" fontWeight="normal" color="grey.200">
                    For signing purposes only. DO NOT send any assets to this
                    address!
                  </Text>
                </Box>
              </Alert>
            </VStack>
          </VStack>
        </Dialog.Body>
        <Dialog.Actions
          w="full"
          maxW={385}
          dividerBorderColor="grey.425"
          position="relative"
          hideDivider
          px={4}
          mb={4}
        >
          <Dialog.PrimaryAction
            flex={3}
            variant="primary"
            onClick={() => {
              navigator.clipboard.writeText(
                Address.fromString(address).toString(),
              );
              onClose();
            }}
            _hover={{
              opacity: 0.8,
            }}
          >
            Copy address
          </Dialog.PrimaryAction>
        </Dialog.Actions>
      </>
    );
  };

  const AlertSteps = {
    [ALERT_STEPS.CHECK_BOX]: check_box(),
    [ALERT_STEPS.CONFIRM]: confirm(),
  };

  const alertComponent = () => {
    return (
      <Dialog.Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        size={{
          base: 'full',
          sm: 'sm',
        }}
        xsBreakPointPy={6}
      >
        <Dialog.Header
          title=""
          description=""
          hidden={true}
          mb={0}
          mt={{ base: 4, xs: 0 }}
          maxW={385}
          h={5}
        />
        {AlertSteps[alertStep]}
      </Dialog.Modal>
    );
  };

  return alertComponent();
};

export { AddressCopyAlert };
