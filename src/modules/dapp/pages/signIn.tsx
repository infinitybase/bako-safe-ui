import { SignInWrapper } from '@/modules/auth/components';
import { useDappSignIn } from '@/modules/auth/hooks/signIn/useDappSignIn';

const DappSignInPage = () => {
  const {
    isAnyWalletConnectorOpen,
    tabs,
    formData,
    formState,
    accountsOptions,
    createdAcccountUsername,
    inputBadge,
    handleSelectWallet,
    handleInputChange,
  } = useDappSignIn();

  return (
    <SignInWrapper
      tabs={tabs}
      formData={formData}
      formState={formState}
      accountsOptions={accountsOptions}
      inputBadge={inputBadge}
      createdAcccountUsername={createdAcccountUsername}
      isAnyWalletConnectorOpen={isAnyWalletConnectorOpen}
      handleInputChange={handleInputChange}
      handleSelectWallet={handleSelectWallet}
    />
  );
};

export { DappSignInPage };
