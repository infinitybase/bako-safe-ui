import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  TabPanel,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { Controller } from 'react-hook-form';

import { UseCreateVaultReturn } from '@/modules/vault/hooks';

export interface VaultInfoStepProps {
  form: UseCreateVaultReturn['form'];
  vaultName: {
    search: string;
    setSearch: (value: string) => void;
    vaultNameIsAvailable: UseCreateVaultReturn['vaultNameIsAvailable'];
    searchHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  };
}

const VaultInfosStep = ({ form, vaultName }: VaultInfoStepProps) => {
  const { search, searchHandler, vaultNameIsAvailable } = vaultName;

  return (
    <TabPanel p={0}>
      <VStack spacing={6}>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormControl>
              <Input
                value={search}
                onChange={(e) => {
                  searchHandler(e);
                  field.onChange(e.target.value);
                }}
                placeholder=" "
                isInvalid={
                  fieldState.invalid ||
                  (vaultNameIsAvailable && search.length > 0)
                }
              />
              <FormLabel>Vault name</FormLabel>
              <FormHelperText
                color={
                  !!vaultNameIsAvailable || form.formState.errors.name?.message
                    ? 'error.500'
                    : 'grey.500'
                }
              >
                {!!vaultNameIsAvailable && search.length > 0
                  ? 'Vault name already exists in this workspace'
                  : form.formState.errors.name?.message
                    ? form.formState.errors.name?.message
                    : search.length > 0
                      ? 'This vault is available'
                      : ''}
              </FormHelperText>
            </FormControl>
          )}
        />
        <FormControl>
          <Textarea {...form.register('description')} placeholder=" " />
          <FormLabel>Description</FormLabel>
          <FormHelperText>Optional</FormHelperText>
        </FormControl>
      </VStack>
    </TabPanel>
  );
};

export { VaultInfosStep };
