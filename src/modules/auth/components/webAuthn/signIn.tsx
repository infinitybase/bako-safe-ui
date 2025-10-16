import { Button, Card, Flex, Stack } from 'bako-ui';
import { useCallback } from 'react';

import { TermsOfUseDialog } from '@/modules/termsOfUse/dialog';

import {
  UseDappSignIn,
  UseWebAuthnSignIn,
  UseWebSignIn,
  WebAuthnModeState,
} from '../../hooks';
import { AnimatedSignInCard } from './animatedSignInCard';
import { WebAuthnForm } from './form';

interface WebAuthnSignInProps {
  formData: UseWebAuthnSignIn['formData'];
  formState: UseWebSignIn['formState'] | UseDappSignIn['formState'];
  accountsOptions: UseWebAuthnSignIn['accountsOptions'];
  inputBadge: UseWebAuthnSignIn['inputBadge'];
  handleInputChange: UseWebAuthnSignIn['handleInputChange'];
  handleRegister: UseWebAuthnSignIn['handleRegister'];
  onModeChange: (mode: WebAuthnModeState) => void;
}

const WebAuthnSignIn = (props: WebAuthnSignInProps) => {
  const {
    formData,
    formState,
    accountsOptions,
    inputBadge,
    handleInputChange,
    handleRegister,
    onModeChange,
  } = props;

  const handleChangeMode = useCallback(() => {
    onModeChange(
      formData.isRegisterMode
        ? WebAuthnModeState.LOGIN
        : WebAuthnModeState.REGISTER,
    );
  }, [onModeChange, formData.isRegisterMode]);

  const mode = formData.isRegisterMode
    ? WebAuthnModeState.REGISTER
    : WebAuthnModeState.LOGIN;

  return (
    <Card.Root w="full" variant="subtle" bg="gray.600" rounded="2xl">
      <Card.Body maxH={250}>
        <AnimatedSignInCard mode={mode}>
          <Stack
            display="flex"
            flexDirection="column"
            gap={{ base: 6, md: 14 }}
          >
            <WebAuthnForm
              formData={formData}
              accountsOptions={accountsOptions}
              isLoadingOptions={formState.isLoadingOptions}
              accountSeachHandler={handleInputChange}
              onSubmitUsingEnterKey={formState.handleActionUsingEnterKey}
              inputBadge={inputBadge}
              isDisabled={formState.disableInput}
            />

            <Flex justifyContent="space-between" alignItems="center" w="full">
              <Button
                fontSize="sm"
                aria-label={formState.label}
                onClick={formState.handleAction}
                disabled={formState.isDisabled}
              >
                {formState.label}
              </Button>

              <Button variant="ghost" onClick={handleChangeMode}>
                {formData.isRegisterMode ? 'Back to login' : 'Create new user'}
              </Button>
            </Flex>
          </Stack>
        </AnimatedSignInCard>
      </Card.Body>
      <TermsOfUseDialog actionHandler={handleRegister} />
    </Card.Root>
  );
};

export { WebAuthnSignIn };
