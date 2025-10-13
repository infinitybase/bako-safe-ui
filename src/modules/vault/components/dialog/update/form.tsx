import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
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
  const { control, handleSubmit, watch } = useForm<PredicateUpdatePayload>({
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
      <VStack spacing={6}>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <Input
                variant="dark"
                // TODO: if vault name already exists, don't show input error
                isInvalid={!!error || alreadyExists}
                placeholder=" "
                {...field}
                type="text"
              />
              <FormLabel>Name</FormLabel>
              {(error || alreadyExists) && (
                <FormHelperText color="error.500">
                  {error?.message || 'Vault name already exists'}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <Textarea
                bg="grey.825"
                borderColor="grey.800"
                isInvalid={!!error}
                rows={3}
                resize="none"
                {...field}
              />
              <FormLabel>Description</FormLabel>
              {error && (
                <FormHelperText color="error.500">
                  {error.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </VStack>
    </form>
  );
};
