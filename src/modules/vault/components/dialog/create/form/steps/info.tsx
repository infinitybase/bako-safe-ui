import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  TabPanel,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';

import { UseCreateVaultReturn } from '@/modules';

export interface VaultInfoStepProps {
  form: UseCreateVaultReturn['form'];
}

const VaultInfosStep = ({ form }: VaultInfoStepProps) => (
  <TabPanel p={0}>
    <VStack spacing={6}>
      <Controller
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormControl>
            <Input
              value={field.value}
              onChange={field.onChange}
              placeholder=" "
            />
            <FormLabel>Vault name</FormLabel>
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
