import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

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
              value={field.value}
              onChange={field.onChange}
              isInvalid={form.formState.isValid && fieldState.invalid}
              autoComplete="off"
              placeholder=" "
              isDisabled={data?.length === 0}
            >
              {data?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
            <FormLabel color="gray">Username</FormLabel>
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
