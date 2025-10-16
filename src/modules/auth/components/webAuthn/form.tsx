import { Field, RhfCombobox, Text, VStack } from 'bako-ui';

import { CloseCircle } from '@/components';

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
    },
    isRegisterMode,
  } = formData;

  const visibility =
    errors.username || inputBadge?.label ? 'visible' : 'hidden';

  return (
    <VStack w="full" alignItems="flex-start" gap={{ base: 4, md: 8 }}>
      <Text
        color="grey.250"
        lineHeight="14.52px"
        fontSize="xs"
        fontWeight={400}
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
          clearTriggerIcon={<CloseCircle />}
        />
      </Field.Root>
    </VStack>
  );
};

export { WebAuthnForm };
