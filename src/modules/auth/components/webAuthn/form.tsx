import { Field, RhfCombobox, Text, VStack } from 'bako-ui';
import { useMemo } from 'react';

import { AutocompleteBadgeStatus, CloseCircle } from '@/components';

import { UseWebAuthnSignIn } from '../../hooks';

interface WebAuthnFormProps {
  formData: UseWebAuthnSignIn['formData'];
  accountsOptions: UseWebAuthnSignIn['accountsOptions'];
  inputBadge: UseWebAuthnSignIn['inputBadge'];
  isLoadingOptions: boolean;
  accountSeachHandler: UseWebAuthnSignIn['handleInputChange'];
  onSubmitUsingEnterKey: UseWebAuthnSignIn['formState']['handleActionUsingEnterKey'];
  isDisabled: boolean;
}

const WebAuthnForm = (props: WebAuthnFormProps) => {
  const {
    formData,
    accountsOptions,
    isLoadingOptions,
    inputBadge,
    accountSeachHandler,
    // onSubmitUsingEnterKey,
    isDisabled,
  } = props;

  const {
    form: {
      control,
      formState: { errors },
      watch,
    },
    isRegisterMode,
  } = formData;

  const visibility =
    errors.username || inputBadge?.label ? 'visible' : 'hidden';

  const name = watch('username') || '';
  const hasName = name.length > 0;
  const isBadgeError = inputBadge?.status === AutocompleteBadgeStatus.ERROR;
  const hasError = useMemo(
    () => hasName && (errors.username || isBadgeError),
    [errors.username, hasName, isBadgeError],
  );

  // Do not show combobox error message
  const usernameErrorWithoutMessage = useMemo(
    () =>
      errors.username ? { ...errors.username, message: undefined } : undefined,
    [errors.username],
  );

  const fieldError = useMemo(
    () =>
      hasError
        ? (usernameErrorWithoutMessage ?? { type: 'validate' }) // If username error is not present, set the generic error
        : undefined,
    [hasError, usernameErrorWithoutMessage],
  );

  return (
    <VStack w="full" alignItems="flex-start" gap={12}>
      <Text
        color="textPrimary"
        lineHeight="100%"
        fontSize="sm"
        fontWeight="semibold"
      >
        {isRegisterMode ? 'Create new user' : 'Login'}
      </Text>
      <Field.Root w="full">
        <Field.HelperText
          visibility={visibility}
          color={hasError ? 'red.400' : 'gray.200'}
        >
          {errors.username
            ? errors.username.message
            : inputBadge?.label || '\u00A0'}
        </Field.HelperText>
        <RhfCombobox
          control={control}
          name="username"
          variant="subtle"
          defaultValue=""
          placeholder="Username"
          disabled={isDisabled}
          isLoadingOptions={isLoadingOptions}
          onInputValueChange={accountSeachHandler}
          options={accountsOptions}
          slotProps={{
            input: {
              pr: '40px', // clear trigger overflow
            },
          }}
          clearTriggerIcon={<CloseCircle />}
          error={fieldError}
          onlyLowercase
        />
      </Field.Root>
    </VStack>
  );
};

export { WebAuthnForm };
