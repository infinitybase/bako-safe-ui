import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { AddressInput } from '@/components/input';
import { queryClient } from '@/config/query-client';
import { UseAddressBookReturn } from '@/modules/addressBook/hooks';
import { OFF_CHAIN_SYNC_DATA_QUERY_KEY } from '@/modules/core/hooks/bako-id';

export interface CreateContactFormProps {
  form: UseAddressBookReturn['form'];
  address?: string;
}

const CreateContactForm = ({ form }: CreateContactFormProps) => {
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [OFF_CHAIN_SYNC_DATA_QUERY_KEY],
    });
  }, []);

  return (
    <VStack spacing={6}>
      <Controller
        control={form.control}
        name="nickname"
        render={({ field, fieldState }) => (
          <FormControl isInvalid={fieldState.invalid}>
            <Input
              value={field.value}
              onChange={field.onChange}
              placeholder=" "
              variant="dark"
              maxLength={27}
            />
            <FormLabel>Name or Label</FormLabel>
            <FormHelperText color="error.500">
              {fieldState.error?.message}
            </FormHelperText>
          </FormControl>
        )}
      />

      <Controller
        control={form.control}
        name="address"
        render={({ field, fieldState }) => (
          <FormControl isInvalid={fieldState.invalid}>
            <AddressInput
              variant="dark"
              value={field.value}
              onChange={field.onChange}
            />
            <FormLabel>Address</FormLabel>
            <FormHelperText color="error.500">
              {fieldState.error?.message}
            </FormHelperText>
          </FormControl>
        )}
      />
    </VStack>
  );
};

export { CreateContactForm };
