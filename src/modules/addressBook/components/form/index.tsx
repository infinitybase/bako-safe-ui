import { Field, RhfInput, VStack } from 'bako-ui';
import { memo, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { CloseCircle } from '@/components';
import { AddressInput } from '@/components/input';
import { ICreateContactFormData } from '@/modules';

export interface CreateContactFormProps {
  address?: string;
}

const CreateContactForm = memo(({ address }: CreateContactFormProps) => {
  const form = useFormContext<ICreateContactFormData>();
  const {
    control,
    formState: { errors },
    setValue,
  } = form;

  const handleClearName = useCallback(() => {
    setValue('nickname', '');
  }, [setValue]);

  return (
    <VStack gap={6}>
      <RhfInput
        name="nickname"
        control={control}
        defaultValue=""
        slotProps={{
          input: { placeholder: 'Name', padding: 3, variant: 'subtle' },
          inputGroup: {
            endElement: (
              <CloseCircle
                boxSize={4}
                color="gray.200"
                onClick={handleClearName}
              />
            ),
          },
        }}
        error={errors.nickname}
      />

      <Controller
        control={control}
        name="address"
        defaultValue={address || ''}
        render={({ field, fieldState }) => (
          <Field.Root invalid={fieldState.invalid}>
            <AddressInput value={field.value} onChange={field.onChange} />
            <Field.HelperText color="error.500">
              {fieldState.error?.message}
            </Field.HelperText>
          </Field.Root>
        )}
      />
    </VStack>
  );
});

CreateContactForm.displayName = 'CreateContactForm';

export { CreateContactForm };
