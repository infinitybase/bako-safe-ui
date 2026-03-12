import { Box, Field, Input, TextArea, VStack } from 'bako-ui';
import { Controller } from 'react-hook-form';

import { PredicateUpdatePayload } from '@/modules/core';
import { UseUpdateVaultForm } from '@/modules/vault/hooks';

interface UpdateVaultFormProps {
  form: UseUpdateVaultForm['form'];
  nameAlreadyExists: boolean;
  onSubmit: (data: PredicateUpdatePayload) => void;
}

export const UpdateVaultForm = (props: UpdateVaultFormProps) => {
  const {
    form: { control, handleSubmit },
    nameAlreadyExists,
    onSubmit,
  } = props;

  return (
    <form id="update-vault-form" onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={4}>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState: { error } }) => (
            <Field.Root invalid={!!error || !!nameAlreadyExists}>
              <Box position="relative" w="full">
                <Input
                  variant="subtle"
                  placeholder="Account name"
                  maxLength={27}
                  {...field}
                  type="text"
                />
              </Box>
              {(error || nameAlreadyExists) && (
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
                placeholder="Description"
                resize="none"
                {...field}
              />
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
