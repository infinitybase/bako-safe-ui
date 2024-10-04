import { FormControl, FormHelperText, VStack } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { AutocompleteBadge } from '@/components';

import { UseWebAuthnSignIn } from '../../hooks';

interface WebAuthnFormProps {
  formData: UseWebAuthnSignIn['formData'];
  accountsOptions: UseWebAuthnSignIn['accountsOptions'];
  inputBadge: UseWebAuthnSignIn['inputBadge'];
  showAccountsOptions: boolean;
  accountSeachHandler: UseWebAuthnSignIn['handleInputChange'];
  onSubmitUsingEnterKey: UseWebAuthnSignIn['formState']['handleActionUsingEnterKey'];
}

const WebAuthnForm = (props: WebAuthnFormProps) => {
  const {
    formData,
    accountsOptions,
    inputBadge,
    showAccountsOptions,
    accountSeachHandler,
    onSubmitUsingEnterKey,
  } = props;

  const {
    form: {
      control,
      formState: { errors },
    },
  } = formData;

  return (
    <VStack w="full" alignItems="flex-start" spacing={2}>
      <Controller
        name="username"
        control={control}
        render={({ field, fieldState }) => {
          return (
            <FormControl isInvalid={fieldState.invalid}>
              <AutocompleteBadge
                label="Username"
                value={field.value}
                onChange={(e) => {
                  accountSeachHandler(e.toLowerCase());
                  field.onChange(e.toLowerCase());
                }}
                onKeyDown={(e) => onSubmitUsingEnterKey?.(e.key)}
                options={accountsOptions}
                showOptions={showAccountsOptions}
                isDisabled={!window.navigator.credentials}
                badgeStatus={inputBadge?.status}
                badgeLabel={inputBadge?.label}
              />
              <FormHelperText
                ml={2}
                color={errors.username ? 'error.500' : 'grey.200'}
              >
                {errors.username && errors.username?.message}
              </FormHelperText>
            </FormControl>
          );
        }}
      />
    </VStack>
  );
};

export { WebAuthnForm };
