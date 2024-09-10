import {
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  TabPanel,
  VStack,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { UseCreateAPITokenReturn } from '@/modules/cli/hooks';

interface CreateAPITokenFormProps {
  form: UseCreateAPITokenReturn['form'];
}

const CreateAPITokenForm = (props: CreateAPITokenFormProps) => {
  const { form } = props;

  return (
    <TabPanel p={0} h="full">
      <Divider my={{ base: 3, sm: 6 }} borderColor="grey.425" />
      <VStack
        h="full"
        minH={400}
        borderTop={1}
        borderColor="grey.950"
        pt={4}
        spacing={4}
      >
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormControl isInvalid={fieldState.invalid}>
              <Input
                variant="dark"
                value={field.value}
                onChange={field.onChange}
                placeholder=" "
              />
              <FormLabel>Key name</FormLabel>
              <FormHelperText color="error.500">
                {fieldState.error?.message}
              </FormHelperText>
            </FormControl>
          )}
        />

        <Controller
          control={form.control}
          name="transactionName"
          render={({ field, fieldState }) => (
            <FormControl isInvalid={fieldState.invalid}>
              <Input
                variant="dark"
                value={field.value}
                onChange={field.onChange}
                placeholder=" "
              />
              <FormLabel>Transaction name</FormLabel>
              <FormHelperText color="error.500">
                {fieldState.error?.message}
              </FormHelperText>
            </FormControl>
          )}
        />
      </VStack>
    </TabPanel>
  );
};

export { CreateAPITokenForm };
