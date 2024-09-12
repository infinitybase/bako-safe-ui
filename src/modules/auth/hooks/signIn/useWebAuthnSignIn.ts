import { useWebAuthn } from '../webAuthn';

export type UseWebAuthnSignIn = ReturnType<typeof useWebAuthnSignIn>;

const useWebAuthnSignIn = () => {
  // const { sessionId, isOpenWebAuth, byConnector } = useQueryParams();

  const { ...rest } = useWebAuthn();

  // const handleSelectWebAuthn = () => {
  //   const isConnector = byConnector && !!sessionId;

  //   if (isConnector) {
  //     window.open(
  //       `${window.origin}/${window.location.search}&openWebAuth=true`,
  //       '_blank',
  //     );
  //   }

  //   return openWebAuthnDrawer();
  // };

  return {
    ...rest,
  };
};

export { useWebAuthnSignIn };
