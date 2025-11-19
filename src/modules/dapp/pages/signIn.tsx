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
    mode,
    currentOpenConnector,
    unableToConnect,
    setMode,
    handleSelectWallet,
    handleInputChange,
    handleRegister,
    connect,
  } = useDappSignIn();

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
      currentOpenConnector={currentOpenConnector}
      unableToConnectWithSocial={unableToConnect}
      handleInputChange={handleInputChange}
      handleSelectWallet={handleSelectWallet}
      handleRegister={handleRegister}
      handleSocialConnect={connect}
      setMode={setMode}
    />
  );
};

export { DappSignInPage };
