import { EFuelConnectorsTypes } from '@/modules/core/hooks';
import { DappEVMSignInPage } from '@/modules/dapp/pages/evmSignIn';
import { DappSignInPage } from '@/modules/dapp/pages/signIn';
import { DappSocialSignInPage } from '@/modules/dapp/pages/socialSignIn';
import { decodeConnectorType } from '@/utils';

import { useQueryParams, WebSignInPage } from '..';

const SignInOriginHandler = () => {
  const { sessionId: isFromDapp, connectorType } = useQueryParams();
  const _connectorType = decodeConnectorType(connectorType || '');

  if (isFromDapp && _connectorType === EFuelConnectorsTypes.EVM) {
    return <DappEVMSignInPage />;
  }

  if (isFromDapp && _connectorType === EFuelConnectorsTypes.SOCIAL) {
    return <DappSocialSignInPage />;
  }

  if (isFromDapp) {
    return <DappSignInPage />;
  }

  return <WebSignInPage />;
};

export { SignInOriginHandler };
