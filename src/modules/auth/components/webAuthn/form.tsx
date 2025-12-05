import { Field, RhfCombobox, Text, VStack } from 'bako-ui';

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

  const isError =
    errors.username ||
    (inputBadge ? inputBadge.status === AutocompleteBadgeStatus.ERROR : false);

  const showErrorColor = isError && name.length > 0;

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
        <Field.HelperText visibility={visibility}>
          {errors.username
            ? errors.username.message
            : inputBadge?.label || '\u00A0'}
        </Field.HelperText>
        <RhfCombobox
          control={control}
          name="username"
          variant="subtle"
          defaultValue=""
          disabled={isDisabled}
          isLoadingOptions={isLoadingOptions}
          onInputValueChange={accountSeachHandler}
          options={accountsOptions}
          slotProps={{
            input: {
              pr: '40px', // clear trigger overflow
              color: showErrorColor ? 'red' : 'textPrimary',
            },
          }}
          clearTriggerIcon={<CloseCircle />}
        />
      </Field.Root>
    </VStack>
  );
};

export { WebAuthnForm };
