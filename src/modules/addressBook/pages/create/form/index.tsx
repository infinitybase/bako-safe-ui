import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  TabPanel,
  VStack,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { UseCreateContactReturn } from '@/modules/addressBook/create';

export interface CreateContactFormProps {
  form: UseCreateContactReturn['form'];
}

interface FieldParams {
  name: 'address' | 'name';
  label: string;
}

const fields: FieldParams[] = [
  { name: 'name', label: 'Name or Label' },
  { name: 'address', label: 'Address' },
];

const CreateContactForm = ({ form }: CreateContactFormProps) => (
  <TabPanel p={0}>
    <VStack spacing={6}>
      {fields.map(({ name, label }, index) => (
        <Controller
          key={index}
          control={form.control}
          name={name}
          render={({ field, fieldState }) => (
            <FormControl isInvalid={fieldState.invalid}>
              <Input
                value={field.value}
                onChange={field.onChange}
                placeholder=" "
              />
              <FormLabel>{label}</FormLabel>
              <FormHelperText color="error.500">
                {fieldState.error?.message}
              </FormHelperText>
            </FormControl>
          )}
        />
      ))}
    </VStack>
  </TabPanel>
);

export { CreateContactForm };
