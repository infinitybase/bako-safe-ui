import { Box, FormControl, FormHelperText } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { Autocomplete } from '@/components';

import { UseWebAuthn } from '../../hooks';

interface LoginWebAuthnFormProps {
  form: UseWebAuthn['form']['loginForm'];
  options: UseWebAuthn['accountsOptions'];
  search: UseWebAuthn['searchAccount'];
}
export const LoginWebAuthnForm = ({
  form,
  options,
  search,
}: LoginWebAuthnFormProps) => {
  return (
    <Box w="full" maxW={480} mb={8}>
      <Controller
        name="name"
        control={form.control}
        render={({ field }) => (
          <FormControl>
            <Autocomplete
              label="Username"
              value={field.value}
              onChange={field.onChange}
              onInputChange={search.handler}
              options={options}
            />
            <FormHelperText
              ml={2}
              color={form.formState.errors.name ? 'error.500' : 'grey.200'}
            >
              {form.formState.errors.name &&
                form.formState.errors.name?.message}
            </FormHelperText>
          </FormControl>
        )}
      />
    </Box>
  );
};
