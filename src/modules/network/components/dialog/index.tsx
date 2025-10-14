import { Button, Field, Input, Loader, VStack } from 'bako-ui';
import { Controller } from 'react-hook-form';

import { Dialog, DialogModalProps } from '@/components';

import { useNetworks } from '../../hooks';

interface NetworkDialogProps extends Omit<DialogModalProps, 'children'> {}

const NetworkDialog = ({ ...props }: NetworkDialogProps) => {
  const {
    handleAddNetwork,
    networkForm,
    handleCheckNetwork,
    validNetwork,
    handleClose,
    checkNetworkRequest: { isPending: loadingCheck },
    setValidNetwork,
  } = useNetworks(() => props.onOpenChange?.({ open: false }));

  return (
    <Dialog.Modal
      size={{ base: 'full', sm: 'lg' }}
      open={props.open}
      closeOnInteractOutside={false}
      onOpenChange={props.onOpenChange}
    >
      <Dialog.Header
        position="relative"
        onClose={handleClose}
        maxW={420}
        title={'Add new Network'}
      />

      <Dialog.Body maxW={420} mt={{ base: -4, sm: -8 }}>
        <VStack gap={10}>
          <VStack gap={2} w="full">
            <Controller
              control={networkForm.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field.Root invalid={fieldState.invalid}>
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder=" "
                    // variant="dark"
                    bg={'grey.825'}
                    border={'1px solid'}
                    borderColor={'grey.125'}
                    disabled={true}
                  />
                  <Field.Label>Name</Field.Label>
                  <Field.HelperText color="error.500">
                    {fieldState.error?.message}
                  </Field.HelperText>
                </Field.Root>
              )}
            />

            <Controller
              control={networkForm.control}
              name="url"
              rules={{ required: 'URL is required' }}
              render={({ field, fieldState }) => (
                <Field.Root invalid={fieldState.invalid}>
                  <Input
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      setValidNetwork(false);
                      networkForm.clearErrors();
                    }}
                    placeholder=" "
                    // variant="dark"
                    bg={'grey.825'}
                    border={'1px solid'}
                    borderColor={validNetwork ? 'brand.500' : 'grey.125'}
                  />
                  <Field.Label>URL</Field.Label>
                  <Field.HelperText color="error.500">
                    {fieldState.error?.message}
                  </Field.HelperText>
                </Field.Root>
              )}
            />

            <Button
              w="full"
              h={'40px'}
              variant="outline"
              color={'grey.75'}
              borderColor={'grey.75'}
              onClick={handleCheckNetwork}
              _hover={{ borderColor: 'inherit', color: 'inherit' }}
              css={{ _active: { bg: 'inherit' } }}
              disabled={loadingCheck}
            >
              {loadingCheck ? <Loader w={4} h={4} /> : 'Test connection'}
            </Button>
          </VStack>
        </VStack>
      </Dialog.Body>

      <Dialog.Actions mt="auto" maxW={420}>
        <Button
          w="100%"
          // variant="primary"
          fontWeight="bold"
          onClick={handleAddNetwork}
          disabled={!validNetwork}
        >
          Add network
        </Button>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { NetworkDialog };
