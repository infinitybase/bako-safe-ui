import { Field, Input, VStack } from 'bako-ui';
import { Controller } from 'react-hook-form';

import { AddressInput } from '@/components/input';
import { UseAddressBookReturn } from '@/modules/addressBook/hooks';

export interface CreateContactFormProps {
  form: UseAddressBookReturn['form'];
  address?: string;
}

const CreateContactForm = ({ form }: CreateContactFormProps) => {
  return (
    <VStack gap={6}>
      <Controller
        control={form.control}
        name="nickname"
        render={({ field, fieldState }) => (
          <Field.Root invalid={fieldState.invalid}>
            <Input
              value={field.value}
              onChange={field.onChange}
              placeholder=" "
              // variant="dark"
              maxLength={27}
            />
            <Field.Label>Name or Label</Field.Label>
            <Field.HelperText color="error.500">
              {fieldState.error?.message}
            </Field.HelperText>
          </Field.Root>
        )}
      />

      <Controller
        control={form.control}
        name="address"
        render={({ field, fieldState }) => (
          <Field.Root invalid={fieldState.invalid}>
            <AddressInput
              // variant="dark"
              value={field.value}
              onChange={field.onChange}
              adbForm={form}
            />
            <Field.HelperText color="error.500">
              {fieldState.error?.message}
            </Field.HelperText>
          </Field.Root>
        )}
      />
    </VStack>
  );
};

export { CreateContactForm };
