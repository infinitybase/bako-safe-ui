import { SignInWrapper } from '@/modules/auth/components';

import { useWebSignIn } from '../hooks/signIn/useWebSignIn';

const WebSignInPage = () => {
  const {
    isAnyWalletConnectorOpen,
    tabs,
    formData,
    formState,
    accountsOptions,
    createdAcccountUsername,
    inputBadge,
    handleRegister,
    handleSelectWallet,
    handleInputChange,
    mode,
    isRegistering,
  } = useWebSignIn();

  return (
    <SignInWrapper
      mode={mode}
      tabs={tabs}
      formData={formData}
      formState={formState}
      accountsOptions={accountsOptions}
      inputBadge={inputBadge}
      createdAcccountUsername={createdAcccountUsername}
      isAnyWalletConnectorOpen={isAnyWalletConnectorOpen}
      handleInputChange={handleInputChange}
      handleSelectWallet={handleSelectWallet}
      handleRegister={handleRegister}
      isRegistering={isRegistering}
    />
  );
};

export { WebSignInPage };
