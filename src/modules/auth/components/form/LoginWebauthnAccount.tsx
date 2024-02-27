import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';

import { UseWebAuthn } from '../../hooks';

interface LoginWebAuthnFormProps {
  form: UseWebAuthn['form']['loginForm'];
}
export const LoginWebAuthnForm = ({ form }: LoginWebAuthnFormProps) => {
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
              defaultValue={''}
              isInvalid={form.formState.isValid}
              autoComplete="off"
              placeholder=" "
            >
              {Array(10)
                .fill(' ')
                .map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
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
