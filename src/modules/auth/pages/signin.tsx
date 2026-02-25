import { SignInWrapper } from '../components';
import { useWebSignIn } from '../hooks';

const WebSignInPage = () => {
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
    handleRegister,
    handleSelectWallet,
    handleInputChange,
    setMode,
    connect,
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

export { WebSignInPage };
