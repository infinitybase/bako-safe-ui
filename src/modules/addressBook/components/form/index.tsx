import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { UseAddressBookReturn } from '@/modules/addressBook/hooks';

export interface CreateContactFormProps {
  form: UseAddressBookReturn['form'];
  address?: string;
}

const CreateContactForm = ({ form }: CreateContactFormProps) => {
  return (
    <VStack spacing={6}>
      <Controller
        control={form.control}
        name="nickname"
        render={({ field, fieldState }) => (
          <FormControl
            isInvalid={fieldState.invalid}
            sx={{
              input: {
                boxShadow: 'none !important',
              },
            }}
          >
            <Input
              value={field.value}
              onChange={field.onChange}
              placeholder=" "
              variant="dark"
              maxLength={27}
              _hover={{
                borderColor: 'grey.425',
              }}
              _focus={{
                borderColor: 'grey.200',
              }}
              border="1px solid"
              borderColor="grey.425"
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
          <FormControl
            isInvalid={fieldState.invalid}
            sx={{
              input: {
                boxShadow: 'none !important',
              },
            }}
          >
            <Input
              variant="dark"
              value={field.value}
              onChange={field.onChange}
              placeholder=" "
              _hover={{
                borderColor: 'grey.425',
              }}
              _focus={{
                borderColor: 'grey.200',
              }}
              border="1px solid"
              borderColor="grey.425"
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
