import { FormControl, FormHelperText, Text, VStack } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { AutocompleteBadge } from '@/components';
import { createGTMCustomEvent } from '@/utils';

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
    <VStack w="full" alignItems="flex-start" spacing={4}>
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
            <FormControl isInvalid={fieldState.invalid}>
              <AutocompleteBadge
                id="fixed_id"
                label="Username"
                aria-label="Username"
                value={field.value}
                onChange={(e) => {
                  const username = e.toLowerCase();
                  accountSeachHandler(username);
                  field.onChange(username);

                  createGTMCustomEvent({
                    eventName: 'input username change',
                    buttonId: 'Login-Screen: input username change',
                    username,
                  });
                }}
                onKeyDown={(e) => {
                  onSubmitUsingEnterKey?.(e.key);

                  if (e.key === 'Enter') {
                    createGTMCustomEvent({
                      eventName: 'input username submit',
                      buttonId: 'Login-Screen: input username submit',
                      username: field.value,
                    });
                  }
                }}
                options={accountsOptions}
                showOptions={showAccountsOptions}
                isDisabled={!window.navigator.credentials || isDisabled}
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
