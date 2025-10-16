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
    handleRegister,
    handleSelectWallet,
    handleInputChange,
    mode,
    setMode,
    currentOpenConnector,
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
      setMode={setMode}
      currentOpenConnector={currentOpenConnector}
    />
  );
};

export { WebSignInPage };
