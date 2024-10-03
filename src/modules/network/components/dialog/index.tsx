import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Spinner,
  VStack,
} from '@chakra-ui/react';
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
    checkNetworkRequest: { isPending: loadingCheck },
  } = useNetworks(props.onClose);

  return (
    <Dialog.Modal
      size={{ base: 'full', sm: 'lg' }}
      isOpen={props.isOpen}
      closeOnOverlayClick={false}
      onClose={props.onClose}
    >
      <Dialog.Header
        position="relative"
        onClose={props.onClose}
        maxW={420}
        title={'Add new Network'}
      />

      <Dialog.Body maxW={420} mt={{ base: -4, sm: -8 }}>
        <VStack spacing={10}>
          <VStack spacing={2} w="full">
            <Controller
              control={networkForm.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormControl isInvalid={fieldState.invalid}>
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder=" "
                    variant="dark"
                    bg={'grey.825'}
                    border={'1px solid'}
                    borderColor={'grey.125'}
                    disabled={true}
                  />
                  <FormLabel>Name</FormLabel>
                  <FormHelperText color="error.500">
                    {fieldState.error?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              control={networkForm.control}
              name="url"
              rules={{ required: 'URL is required' }}
              render={({ field, fieldState }) => (
                <FormControl isInvalid={fieldState.invalid}>
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder=" "
                    variant="dark"
                    bg={'grey.825'}
                    border={'1px solid'}
                    borderColor={validNetwork ? 'brand.500' : 'grey.125'}
                  />
                  <FormLabel>URL</FormLabel>
                  <FormHelperText color="error.500">
                    {fieldState.error?.message}
                  </FormHelperText>
                </FormControl>
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
              sx={{ _active: { bg: 'inherit' } }}
              disabled={loadingCheck}
            >
              {loadingCheck ? <Spinner w={4} h={4} /> : 'Test connection'}
            </Button>
          </VStack>
        </VStack>
      </Dialog.Body>

      <Dialog.Actions mt="auto" maxW={420}>
        <Dialog.PrimaryAction onClick={handleAddNetwork}>
          Add Network
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { NetworkDialog };
