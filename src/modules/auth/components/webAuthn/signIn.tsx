import { VStack } from '@chakra-ui/react';

import { ProgressButton } from '@/components';

import { UseWebAuthnSignIn } from '../../hooks';
import { WebAuthnForm } from './form';

interface WebAuthnSignInProps {
  formData: UseWebAuthnSignIn['formData'];
  formState: UseWebAuthnSignIn['formState'];
  accountsOptions: UseWebAuthnSignIn['accountsOptions'];
  handleInputChange: UseWebAuthnSignIn['handleInputChange'];
}

const WebAuthnSignIn = (props: WebAuthnSignInProps) => {
  const { formData, formState, accountsOptions, handleInputChange } = props;

  return (
    <VStack w="full" spacing={6}>
      <WebAuthnForm
        formData={formData}
        accountsOptions={accountsOptions}
        showAccountsOptions={true}
        accountSeachHandler={handleInputChange}
        onSubmitUsingEnterKey={formState.handleActionUsingEnterKey}
      />

      <ProgressButton
        w="full"
        variant="primary"
        onClick={formState.handleAction}
        _hover={{
          opacity: formState.isDisabled && 0.8,
        }}
        isDisabled={formState.isDisabled}
        progress={formState.actionProgress}
      >
        {formState.label}
      </ProgressButton>
    </VStack>
  );
};

export { WebAuthnSignIn };
