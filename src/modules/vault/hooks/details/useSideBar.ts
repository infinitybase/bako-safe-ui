import { useDisclosure } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Pages } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

type UseSidebarProps = {
  params: { workspaceId: string; vaultId: string };
};

const useSidebar = ({ params }: UseSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const drawer = useDisclosure();
  const {
    authDetails: {
      userInfos: { workspace },
    },
  } = useWorkspaceContext();

  const checkPathname = (path: string) => location.pathname === path;

  const menuItems = {
    overview: checkPathname(
      Pages.detailsVault({
        workspaceId: params?.workspaceId ?? '',
        vaultId: params?.vaultId ?? '',
      }),
    ),
    settings: checkPathname(
      Pages.vaultSettings({
        vaultId: params?.vaultId ?? '',
        workspaceId: workspace?.id ?? '',
      }),
    ),
    transactions: checkPathname(
      Pages.transactions({
        vaultId: params?.vaultId ?? '',
        workspaceId: workspace?.id ?? '',
      }),
    ),
    balance: checkPathname(
      Pages.vaultBalance({
        vaultId: params?.vaultId ?? '',
        workspaceId: workspace?.id ?? '',
      }),
    ),
    bridge: checkPathname(
      Pages.bridge({
        vaultId: params?.vaultId ?? '',
        workspaceId: workspace?.id ?? '',
      }),
    ),
    buySell: checkPathname(
      Pages.vaultBuySell({
        vaultId: params?.vaultId ?? '',
        workspaceId: workspace?.id ?? '',
      }),
    ),
    swap: checkPathname(
      Pages.vaultSwap({
        vaultId: params?.vaultId ?? '',
        workspaceId: workspace?.id ?? '',
      }),
    ),
  };

  return {
    route: {
      params,
      navigate,
    },
    drawer,
    menuItems,
  };
};

export { useSidebar };
