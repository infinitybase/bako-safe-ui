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

  const name = form.watch('nickname');

  return (
    <VStack gap={6}>
      <RhfInput
        name="nickname"
        control={control}
        defaultValue=""
        slotProps={{
          input: {
            placeholder: 'Name',
            padding: 3,
            variant: 'subtle',
            maxLength: 27,
          },
          inputGroup: {
            endElement: name && (
              <CloseCircle
                boxSize={4}
                color="gray.200"
                cursor="pointer"
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
            <AddressInput
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          </Field.Root>
        )}
      />
    </VStack>
  );
});

CreateContactForm.displayName = 'CreateContactForm';

export { CreateContactForm };
