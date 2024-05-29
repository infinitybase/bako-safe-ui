import { Box, FormControl, FormHelperText } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { UseWebAuthn } from '../../hooks';
import { WebAuthnLoginInput } from '../webAuthnLoginInput';

interface LoginWebAuthnFormProps {
  form: UseWebAuthn['form']['loginForm'];
  accountsOptions: UseWebAuthn['accountsOptions'];
  showAccountsOptions: boolean;
  onSubmitUsingEnterKey: UseWebAuthn['form']['formState']['handlePrimaryActionUsingEnterKey'];
}

export const LoginWebAuthnForm = ({
  form,
  accountsOptions,
  showAccountsOptions,
  onSubmitUsingEnterKey,
}: LoginWebAuthnFormProps) => {
  return (
    <Box w="full" mb={6} p="1px">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => {
          return (
            <FormControl isInvalid={fieldState.invalid}>
              <WebAuthnLoginInput
                value={field.value}
                onChange={field.onChange}
                onKeyDown={(e) => onSubmitUsingEnterKey(e)}
                options={accountsOptions}
                showOptions={showAccountsOptions}
              />
              <FormHelperText
                ml={2}
                color={form.formState.errors.name ? 'error.500' : 'grey.200'}
              >
                {form.formState.errors.name &&
                  form.formState.errors.name?.message}
              </FormHelperText>
            </FormControl>
          );
        }}
      />
    </Box>
  );
};
