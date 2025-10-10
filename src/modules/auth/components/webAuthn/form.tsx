import { Field,  Text, VStack } from '@chakra-ui/react';
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
  isDisabled: boolean;
}

const WebAuthnForm = (props: WebAuthnFormProps) => {
  const {
    formData,
    accountsOptions,
    inputBadge,
    showAccountsOptions,
    accountSeachHandler,
    onSubmitUsingEnterKey,
    isDisabled,
  } = props;

  const {
    form: {
      control,
      formState: { errors },
    },
  } = formData;

  return (
    <VStack w="full" alignItems="flex-start" gap={4}>
      <Text
        color="grey.250"
        lineHeight="14.52px"
        fontSize="xs"
        fontWeight={400}
      >
        Login with passkey
      </Text>
      <Controller
        name="username"
        control={control}
        render={({ field, fieldState }) => {
          return (
            <Field.Root invalid={fieldState.invalid}>
              <AutocompleteBadge
                id="fixed_id"
                label="Username"
                aria-label="Username"
                value={field.value}
                onChange={(e) => {
                  accountSeachHandler(e.toLowerCase());
                  field.onChange(e.toLowerCase());
                }}
                onKeyDown={(e) => onSubmitUsingEnterKey?.(e.key)}
                options={accountsOptions}
                showOptions={showAccountsOptions}
                isDisabled={!window.navigator.credentials || isDisabled}
                badgeStatus={inputBadge?.status}
                badgeLabel={inputBadge?.label}
              />
              <Field.HelperText
                ml={2}
                color={errors.username ? 'error.500' : 'grey.200'}
              >
                {errors.username && errors.username?.message}
              </Field.HelperText>
            </Field.Root>
          );
        }}
      />
    </VStack>
  );
};

export { WebAuthnForm };
