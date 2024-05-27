import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { UseWebAuthn } from '../../hooks';

interface LoginWebAuthnFormProps {
  form: UseWebAuthn['form']['loginForm'];
  onSubmitUsingEnterKey: UseWebAuthn['form']['formState']['handlePrimaryActionUsingEnterKey'];
}

export const LoginWebAuthnForm = ({
  form,
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
              <Input
                placeholder=" "
                value={field.value}
                onChange={field.onChange}
                onKeyDown={(e) => onSubmitUsingEnterKey(e)}
              />
              <FormLabel>Username</FormLabel>
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
