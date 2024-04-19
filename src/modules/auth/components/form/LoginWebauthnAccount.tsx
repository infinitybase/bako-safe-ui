import { Box, FormControl, FormHelperText } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { Select } from '@/components';

import { UseWebAuthn } from '../../hooks';

interface LoginWebAuthnFormProps {
  form: UseWebAuthn['form']['loginForm'];
  request: UseWebAuthn['accountsRequest'];
}
export const LoginWebAuthnForm = ({
  form,
  request,
}: LoginWebAuthnFormProps) => {
  const { data } = request;

  return (
    <Box w="full" maxW={480} mb={8}>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <FormControl>
            <Select
              label="Username"
              value={field.value}
              onChange={field.onChange}
              options={data?.map((user) => ({
                label: user.name,
                value: user.webauthn.id,
              }))}
              isDisabled={data?.length === 0}
            />
            <FormHelperText
              ml={2}
              color={form.formState.errors.name ? 'error.500' : 'grey.200'}
            >
              {form.formState.errors.name
                ? form.formState.errors.name?.message
                : !fieldState.isDirty && 'Select your username'}
            </FormHelperText>
          </FormControl>
        )}
      />
    </Box>
  );
};
