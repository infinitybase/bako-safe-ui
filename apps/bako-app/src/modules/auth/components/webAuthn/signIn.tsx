import { ProgressButton } from '@bako-safe/ui';
import { VStack } from '@chakra-ui/react';

import { useScreenSize } from '@/modules/core/hooks';
import { TermsOfUseDialog } from '@/modules/termsOfUse/dialog';

import type { UseWebAuthnSignIn, UseWebSignIn } from '../../hooks';
import { WebAuthnForm } from './form';

interface WebAuthnSignInProps {
  formData: UseWebAuthnSignIn['formData'];
  formState: UseWebSignIn['formState'];
  accountsOptions: UseWebAuthnSignIn['accountsOptions'];
  inputBadge: UseWebAuthnSignIn['inputBadge'];
  handleInputChange: UseWebAuthnSignIn['handleInputChange'];
  handleRegister: UseWebAuthnSignIn['handleRegister'];
}

const WebAuthnSignIn = (props: WebAuthnSignInProps) => {
  const {
    formData,
    formState,
    accountsOptions,
    inputBadge,
    handleInputChange,
    handleRegister,
  } = props;

  const { isMobile } = useScreenSize();

  return (
    <VStack w="full" spacing={isMobile ? 4 : 6}>
      <TermsOfUseDialog actionHandler={handleRegister} />

      <WebAuthnForm
        formData={formData}
        accountsOptions={accountsOptions}
        showAccountsOptions={formState.showAccountsOptions}
        accountSeachHandler={handleInputChange}
        onSubmitUsingEnterKey={formState.handleActionUsingEnterKey}
        inputBadge={inputBadge}
        isDisabled={formState.disableInput}
      />

      <ProgressButton
        w="full"
        variant="primary"
        fontSize="sm"
        onClick={formState.handleAction}
        _hover={{ opacity: formState.isDisabled && 0.8 }}
        isDisabled={formState.isDisabled}
        progress={formState.actionProgress}
      >
        {formState.label}
      </ProgressButton>
    </VStack>
  );
};

export { WebAuthnSignIn };
