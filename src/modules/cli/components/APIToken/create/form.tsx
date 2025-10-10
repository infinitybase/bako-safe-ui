import { Box, Field, Input, Separator, VStack } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { UseCreateAPITokenReturn } from '@/modules/cli/hooks';

interface CreateAPITokenFormProps {
  form: UseCreateAPITokenReturn['form'];
}

const CreateAPITokenForm = (props: CreateAPITokenFormProps) => {
  const { form } = props;

  return (
    <Box p={0} h="full">
      <Separator my={{ base: 3, sm: 6 }} borderColor="grey.425" />
      <VStack
        h="full"
        minH={400}
        borderTop={1}
        borderColor="grey.950"
        pt={4}
        gap={4}
      >
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field.Root invalid={fieldState.invalid}>
              <Input
                // variant="dark"
                value={field.value}
                onChange={field.onChange}
                placeholder=" "
                maxLength={27}
                aria-label={'Input key name api token'}
              />
              <Field.Label>Key name</Field.Label>
              <Field.HelperText color="error.500">
                {fieldState.error?.message}
              </Field.HelperText>
            </Field.Root>
          )}
        />

        <Controller
          control={form.control}
          name="transactionName"
          render={({ field, fieldState }) => (
            <Field.Root invalid={fieldState.invalid}>
              <Input
                // variant="dark"
                value={field.value}
                onChange={field.onChange}
                placeholder=" "
                maxLength={199}
                aria-label={'Input tx api token'}
              />
              <Field.Label>Transaction name</Field.Label>
              <Field.HelperText color="error.500">
                {fieldState.error?.message}
              </Field.HelperText>
            </Field.Root>
          )}
        />
      </VStack>
    </Box>
  );
};

export { CreateAPITokenForm };
