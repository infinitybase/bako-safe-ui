import { useEffect } from 'react';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useQueryParams } from '../usePopup';
import { useWebAuthn } from '../useWebAuthn';

const useWebAuthnSignIn = () => {
  const { sessionId, isOpenWebAuth, byConnector } = useQueryParams();
  const { invalidateGifAnimationRequest } = useWorkspaceContext();
  const { openWebAuthnDrawer, ...rest } = useWebAuthn(
    invalidateGifAnimationRequest,
  );

  const handleSelectWebAuthn = () => {
    const isConnector = byConnector && !!sessionId;

    if (isConnector) {
      window.open(
        `${window.origin}/${window.location.search}&openWebAuth=true`,
        '_blank',
      );
    }

    return openWebAuthnDrawer();
  };

  useEffect(() => {
    if (isOpenWebAuth) {
      openWebAuthnDrawer();
    }
  }, []);

  return {
    handleSelectWebAuthn,
    openWebAuthnDrawer,
    ...rest,
  };
};

export { useWebAuthnSignIn };
