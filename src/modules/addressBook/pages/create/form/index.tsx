import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  TabPanel,
  VStack,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { UseCreateContactReturn } from '@/modules/addressBook/hooks';

export interface CreateContactFormProps {
  form: UseCreateContactReturn['form'];
  address?: string;
}

const CreateContactForm = ({ form, address }: CreateContactFormProps) => {
  return (
    <TabPanel p={0}>
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
                value={address ?? field.value}
                onChange={field.onChange}
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
    </TabPanel>
  );
};

export { CreateContactForm };
