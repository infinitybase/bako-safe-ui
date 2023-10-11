import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  TabPanel,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { Controller, UseFormReturn } from 'react-hook-form';

import { ITemplatePayload } from '@/modules/core';
const InfoStep = ({ form }: { form: UseFormReturn<ITemplatePayload> }) => {
  return (
    <TabPanel p={0}>
      <VStack spacing={6}>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormControl isInvalid={fieldState.invalid}>
              <Input
                value={field.value}
                onChange={field.onChange}
                placeholder=" "
              />
              <FormLabel>Vault name</FormLabel>
              <FormHelperText color="error.500">
                {fieldState.error?.message}
              </FormHelperText>
            </FormControl>
          )}
        />
        <FormControl>
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormControl isInvalid={fieldState.invalid}>
                <Textarea
                  value={field.value}
                  onChange={field.onChange}
                  placeholder=" "
                />
                <FormLabel>Description</FormLabel>
                <FormHelperText color="error.500">
                  {fieldState.error?.message}
                </FormHelperText>
              </FormControl>
            )}
          />
          <FormHelperText>Optional</FormHelperText>
        </FormControl>
      </VStack>
    </TabPanel>
  );
};

export { InfoStep };
