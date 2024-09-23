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

import { AutocompleteBadge } from '@/components';
import { CheckIcon } from '@/components/icons';
import { Pages } from '@/modules/core';
import { useScreenSize } from '@/modules/core/hooks';

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
    isRegisterMode,
  } = formData;

  const { isMobile } = useScreenSize();

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
                  accountSeachHandler(e);
                  field.onChange(e);
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

      {isRegisterMode && (
        <Controller
          name="termsOfUse"
          control={control}
          render={({ field }) => (
            <HStack gap={1} mb={isMobile ? 0 : 2}>
              <Checkbox
                position="relative"
                ml={2}
                icon={<CheckIcon fontSize={8} />}
                size="sm"
                isChecked={!!field.value}
                onChange={field.onChange}
              />
              <Text ml={1} textColor="grey.250" fontSize="xs">
                I agree to the
              </Text>
              <Link
                target="_blank"
                textColor="grey.250"
                fontSize="xs"
                href={Pages.termsOfUse()}
              >
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
