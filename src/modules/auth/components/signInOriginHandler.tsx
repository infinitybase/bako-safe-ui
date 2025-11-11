import { EConnectorsLabels } from '@/modules/core/hooks/fuel/useListConnectors';
import { DappEVMSignInPage } from '@/modules/dapp/pages/evmSignIn';
import { DappSignInPage } from '@/modules/dapp/pages/signIn';
import { DappSocialSignInPage } from '@/modules/dapp/pages/socialSignIn';

import { useQueryParams, WebSignInPage } from '..';

const SignInOriginHandler = () => {
  const { sessionId: isFromDapp, connectorType } = useQueryParams();
  const _connectorType = decodeURIComponent(connectorType ?? '');

  if (isFromDapp && _connectorType === EConnectorsLabels.EVM) {
    return <DappEVMSignInPage />;
  }

  if (isFromDapp && _connectorType === EConnectorsLabels.SOCIAL) {
    return <DappSocialSignInPage />;
  }

  if (isFromDapp) {
    return <DappSignInPage />;
  }

  return <WebSignInPage />;
};

export { SignInOriginHandler };
