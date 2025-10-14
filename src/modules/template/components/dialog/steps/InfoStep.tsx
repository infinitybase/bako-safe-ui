import { Box, Field, Input, TextArea, VStack } from 'bako-ui';
import { Controller, UseFormReturn } from 'react-hook-form';

import { ITemplatePayload } from '@/modules/core';
const InfoStep = ({ form }: { form: UseFormReturn<ITemplatePayload> }) => {
  return (
    <Box p={0}>
      <VStack gap={6}>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field.Root invalid={fieldState.invalid}>
              <Input
                value={field.value}
                onChange={field.onChange}
                placeholder=" "
              />
              <Field.Label>Template name</Field.Label>
              <Field.HelperText color="error.500">
                {fieldState.error?.message}
              </Field.HelperText>
            </Field.Root>
          )}
        />
        <Field.Root>
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field.Root
                invalid={fieldState.invalid}
                css={{
                  'textarea::placeholder': {
                    color: 'grey.500',
                  },
                }}
              >
                <TextArea
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Description"
                />
                <Field.HelperText color="error.500">
                  {fieldState.error?.message}
                </Field.HelperText>
              </Field.Root>
            )}
          />
          <Field.HelperText>Optional</Field.HelperText>
        </Field.Root>
      </VStack>
    </Box>
  );
};

export { InfoStep };
