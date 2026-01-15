import { Box, Field, Icon, Input, InputGroup, VStack } from 'bako-ui';
import { Controller } from 'react-hook-form';
import { Dialog } from '@/components';

import { UseCreateAPITokenReturn } from '@/modules/cli/hooks';
import { CloseCircle } from "@/components";

interface CreateAPITokenFormProps {
  form: UseCreateAPITokenReturn['form'];
  steps: any;
}

const CreateAPITokenForm = (props: CreateAPITokenFormProps) => {
  const { form, steps } = props;
  const nameValue = form.watch('name');

  return (
    <Box h="full">
      <VStack
        h="full"
        minH={400}
        borderTop={1}
        borderColor="grey.950"
        pt={2}
        gap={4}
        justifyContent="space-between"
      >
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field.Root invalid={fieldState.invalid} px={6}>
              <InputGroup
                bg="gray.600"
                rounded="8px"
                endElement={
                  <Icon
                    as={CloseCircle}
                    display={field.value ? 'block' : 'none'}
                    onClick={() => field.onChange('')}
                  />
                }
              >
                <Input
                  variant="subtle"
                  placeholder="Key name"
                  _placeholder={{
                    color: 'textSecondary',
                  }}
                  {...field}
                  onChange={({ target }) => field.onChange(target.value)}
                />
              </InputGroup>
              <Field.Label fontSize="12px" fontWeight="400" color="gray.200" pl="4px">That is the name of your API Token.</Field.Label>
              <Field.ErrorText pl="4px">{fieldState.error?.message}</Field.ErrorText>
            </Field.Root>
          )}
        />

        <Controller
          control={form.control}
          name="transactionName"
          render={({ field, fieldState }) => (
            <Field.Root invalid={fieldState.invalid} px={6}>
              <InputGroup
                bg="gray.600"
                rounded="8px"
                endElement={
                  <Icon
                    as={CloseCircle}
                    display={field.value ? 'block' : 'none'}
                    onClick={() => field.onChange('')}
                  />
                }
              >
                <Input
                  variant="subtle"
                  placeholder="Transaction name"
                  _placeholder={{
                    color: 'textSecondary',
                  }}
                  {...field}
                  onChange={({ target }) => field.onChange(target.value)}
                />
              </InputGroup>
              <Field.Label fontSize="12px" fontWeight="400" color="gray.200" pl="4px">That is the name what will appear in your transactions’ info.</Field.Label>
              <Field.ErrorText pl="4px">{fieldState.error?.message}</Field.ErrorText>
            </Field.Root>
          )}
        />
        <VStack
          w="full"
          bg="bg.muted"
          justifySelf="center"
          p="24px"
          mt="auto"
          roundedTop="2xl"
          roundedBottom={{ base: 'none', sm: '2xl' }}
          css={{
            boxShadow: '0px -12px 8px 0px #0D0D0C99',
          }}
        >
          <Dialog.Actions>
            <Dialog.SecondaryAction
              flex={1}
              variant="subtle"
              onClick={steps.step.secondaryAction.handler}
              aria-label="Secundary action create api token"
              bg="transparent"
              _hover={{ bg: 'gray.500' }}
            >
              {steps.step.secondaryAction.label}
            </Dialog.SecondaryAction>
            <Dialog.PrimaryAction
              flex={3}
              hidden={steps.step.primaryAction.hide}
              onClick={steps.step.primaryAction.handler}
              disabled={!nameValue || steps.step.primaryAction.disabled}
              _hover={{
                opacity: !steps.step.primaryAction.disabled ? 0.8 : 1,
              }}
              loading={steps.step.primaryAction.isLoading}
              aria-label="Primary action create api token"
            >
              {steps.step.primaryAction.label}
            </Dialog.PrimaryAction>
          </Dialog.Actions>
        </VStack>
      </VStack>
    </Box>
  );
};

export { CreateAPITokenForm };
