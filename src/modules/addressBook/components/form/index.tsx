import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { queryClient } from '@/config/query-client';
import { UseAddressBookReturn } from '@/modules/addressBook/hooks';
import { OFF_CHAIN_SYNC_DATA_QUERY_KEY } from '@/modules/core/hooks/bako-id';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { syncAddressBookInputValue } from '../../utils';

export interface CreateContactFormProps {
  form: UseAddressBookReturn['form'];
  address?: string;
}

const CreateContactForm = ({ form }: CreateContactFormProps) => {
  const { offChainSync } = useWorkspaceContext();

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
            <Input
              variant="dark"
              value={syncAddressBookInputValue(field.value, offChainSync).label}
              onChange={(e) => {
                e.target.value = syncAddressBookInputValue(
                  e.target.value,
                  offChainSync,
                ).value;
                field.onChange(e);
              }}
              placeholder=" "
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
