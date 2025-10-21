import { Field, RhfInput, VStack } from 'bako-ui';
import { Controller, useFormContext } from 'react-hook-form';

import { AddressInput } from '@/components/input';
import { ICreateContactFormData } from '@/modules';

export interface CreateContactFormProps {
  address?: string;
}

const CreateContactForm = ({ address }: CreateContactFormProps) => {
  const form = useFormContext<ICreateContactFormData>();
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <VStack gap={6}>
      <RhfInput
        label="Name or Label"
        name="nickname"
        control={control}
        defaultValue=""
        error={errors.nickname}
      />

      <Controller
        control={control}
        name="address"
        defaultValue={address || ''}
        render={({ field, fieldState }) => (
          <Field.Root invalid={fieldState.invalid}>
            <AddressInput
              value={field.value}
              onChange={field.onChange}
              // @ts-expect-error - AddressInput expects the full form object
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
