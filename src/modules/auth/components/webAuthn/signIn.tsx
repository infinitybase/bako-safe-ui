import { VStack } from '@chakra-ui/react';

import { ProgressButton } from '@/components';
import { useScreenSize } from '@/modules/core/hooks';

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

  const { isMobile } = useScreenSize();

  return (
    <VStack w="full" spacing={isMobile ? 4 : 6}>
      <WebAuthnForm
        formData={formData}
        accountsOptions={accountsOptions}
        showAccountsOptions={formState.showAccountsOptions}
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
