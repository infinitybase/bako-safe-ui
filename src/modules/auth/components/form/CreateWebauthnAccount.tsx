import { SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';

import { UseWebAuthn, useWebAuthn } from '../../hooks';

interface CreateWebAuthnFormProps {
  form: UseWebAuthn['form']['memberForm'];
}
export const CreateWebAuthnForm = ({ form }: CreateWebAuthnFormProps) => {
  // const { debouncedSearchHandler } = useWebAuthn();
  const { search, setSearch } = useWebAuthn();

  return (
    <Box w="full" maxW={480} mb={8}>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Box position="relative">
            <FormControl>
              <Input
                value={search}
                placeholder=""
                onChange={(e) => {
                  setSearch(e.target.value);
                  field.onChange(e);
                }}
                isInvalid={fieldState.invalid}
              />
              <FormLabel color="gray">Name</FormLabel>
              <FormHelperText color="error.500">
                {form.formState.errors.name?.message}
              </FormHelperText>
            </FormControl>
            <SmallCloseIcon
              position="absolute"
              top={3.5}
              right={4}
              w={5}
              h={5}
              _hover={{
                cursor: 'pointer',
              }}
              onClick={() => setSearch('')}
            />
          </Box>
        )}
      />
    </Box>
  );
};
