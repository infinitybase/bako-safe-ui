import {
  Checkbox,
  FormControl,
  FormHelperText,
  HStack,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { UseWebAuthnSignIn } from '../../hooks';
import { WebAuthnLoginInput } from '../webAuthnLoginInput';

interface WebAuthnFormProps {
  formData: UseWebAuthnSignIn['formData'];
  accountsOptions: UseWebAuthnSignIn['accountsOptions'];
  showAccountsOptions: boolean;
  accountSeachHandler: UseWebAuthnSignIn['handleInputChange'];
  onSubmitUsingEnterKey: UseWebAuthnSignIn['formState']['handleActionUsingEnterKey'];
}

const WebAuthnForm = (props: WebAuthnFormProps) => {
  const {
    formData,
    accountsOptions,
    showAccountsOptions,
    accountSeachHandler,
    onSubmitUsingEnterKey,
  } = props;

  const {
    form: {
      control,
      formState: { errors },
    },
    isRegisterMode,
  } = formData;

  return (
    <VStack w="full" alignItems="flex-start" spacing={2}>
      <Controller
        name="username"
        control={control}
        render={({ field, fieldState }) => {
          return (
            <FormControl isInvalid={fieldState.invalid}>
              <WebAuthnLoginInput
                value={field.value}
                onChange={(e) => {
                  accountSeachHandler(e);
                  field.onChange(e);
                }}
                onKeyDown={(e) => onSubmitUsingEnterKey?.(e.key)}
                options={accountsOptions}
                showOptions={showAccountsOptions}
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

      {isRegisterMode && (
        <Controller
          name="termsOfUse"
          control={control}
          render={({ field }) => (
            <HStack gap={1}>
              <Checkbox
                position="relative"
                ml={2}
                size="sm"
                colorScheme="gray"
                borderColor="grey.75"
                iconColor="grey.850"
                _checked={{
                  '& .chakra-checkbox__control': {
                    background: 'grey.75',
                    borderColor: 'grey.75',
                  },
                }}
                isChecked={!!field.value}
                onChange={field.onChange}
              />
              <Text ml={1} textColor="grey.250" fontSize="xs">
                I agree to the
              </Text>
              <Link textColor="grey.250" fontSize="xs">
                Terms of use
              </Link>
            </HStack>
          )}
        />
      )}
    </VStack>
  );
};

export { WebAuthnForm };
