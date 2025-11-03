import { Box, Field, floatingStyles, Input, TextArea, VStack } from 'bako-ui';
import { ChangeEvent, useEffect } from 'react';
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
  const formName = form.watch('name');

  useEffect(() => {
    form.setValue('name', search);
  }, [formName]);

  return (
    <Box p={0}>
      <VStack gap={6}>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field.Root
              invalid={
                fieldState.invalid ||
                (vaultNameIsAvailable && search.length > 0)
              }
            >
              <Box position="relative" w="full">
                <Input
                  id="vault_name"
                  value={search}
                  defaultValue={search || form.watch('name')}
                  maxLength={27}
                  pt={2}
                  onChange={(e) => {
                    searchHandler(e);
                    field.onChange(e.target.value);
                  }}
                  placeholder=" "
                />
                <Field.Label css={floatingStyles({ hasValue: !!field.value })}>
                  Account name
                </Field.Label>
              </Box>
              <Field.HelperText
                color={
                  !!vaultNameIsAvailable || form.formState.errors.name?.message
                    ? 'error.500'
                    : 'gray.550'
                }
              >
                {!!vaultNameIsAvailable && search.length > 0
                  ? 'Account name already exists in this workspace'
                  : form.formState.errors.name?.message
                    ? form.formState.errors.name?.message
                    : search.length > 0
                      ? 'This account is available'
                      : ''}
              </Field.HelperText>
            </Field.Root>
          )}
        />
        <Field.Root
          css={{
            'Aa::placeholder': {
              color: 'gray.500',
            },
          }}
        >
          <TextArea
            {...form.register('description')}
            id="vault_description"
            maxLength={199}
            placeholder="Description"
            resize="none"
          />
          <Field.HelperText>Optional</Field.HelperText>
        </Field.Root>
      </VStack>
    </Box>
  );
};

export { VaultInfosStep };
