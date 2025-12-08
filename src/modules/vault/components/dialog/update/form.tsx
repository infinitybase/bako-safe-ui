import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Field, floatingStyles, Input, TextArea, VStack } from 'bako-ui';
import { Controller, useForm } from 'react-hook-form';

import { PredicateUpdatePayload, useDebounce } from '@/modules/core';
import { useCheckVaultName } from '@/modules/vault/hooks/useGetByNameVaultRequest';

import schema from './schema';

interface UpdateVaultFormProps {
  initialValues: PredicateUpdatePayload;
  vaultId: string;
  onSubmit: (data: PredicateUpdatePayload) => void;
}

export const UpdateVaultForm = ({
  initialValues,
  onSubmit,
  vaultId,
}: UpdateVaultFormProps) => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      name: initialValues.name,
      description: initialValues.description,
    },
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });
  const currentName = watch('name');
  const debouncedName = useDebounce(currentName, 600);
  const { data: alreadyExists } = useCheckVaultName(debouncedName, vaultId);

  return (
    <form id="update-vault-form" onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={6}>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState: { error } }) => (
            <Field.Root invalid={!!error || !!alreadyExists}>
              <Box position="relative" w="full">
                <Input
                  variant="subtle"
                  placeholder=" "
                  maxLength={27}
                  {...field}
                  pt={2}
                  maxLength={27}
                  type="text"
                />
                <Field.Label css={floatingStyles({ hasValue: !!field.value })}>
                  Account name
                </Field.Label>
              </Box>
              {(error || alreadyExists) && (
                <Field.ErrorText color="error.500">
                  {error?.message || 'Account name already exists'}
                </Field.ErrorText>
              )}
            </Field.Root>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field, fieldState: { error } }) => (
            <Field.Root invalid={!!error}>
              <TextArea
                variant="subtle"
                rows={3}
                placeholder=" "
                pt={3}
                resize="none"
                {...field}
              />
              <Field.Label css={floatingStyles({ hasValue: !!field.value })}>
                Description
              </Field.Label>
              {error && (
                <Field.ErrorText color="error.500">
                  {error.message}
                </Field.ErrorText>
              )}
            </Field.Root>
          )}
        />
      </VStack>
    </form>
  );
};
