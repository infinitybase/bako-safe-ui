import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  TabPanel,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { UseCreateVaultReturn } from '@/modules/vault/hooks';

export interface VaultInfoStepProps {
  form: UseCreateVaultReturn['form'];
}

const VaultInfosStep = ({ form }: VaultInfoStepProps) => (
  <TabPanel p={0}>
    <VStack spacing={6}>
      <Controller
        control={form.control}
        name="name"
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
        <Textarea {...form.register('description')} placeholder=" " />
        <FormLabel>Description</FormLabel>
        <FormHelperText>Optional</FormHelperText>
      </FormControl>
    </VStack>
  </TabPanel>
);

export { VaultInfosStep };
