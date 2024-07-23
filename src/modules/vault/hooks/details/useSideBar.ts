import { useDisclosure } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/modules/auth';
import { Pages } from '@/modules/core';

type UseSidebarProps = {
  params: { workspaceId: string; vaultId: string };
};

const useSidebar = ({ params }: UseSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const drawer = useDisclosure();
  const {
    workspaces: { current },
  } = useAuth();

  const checkPathname = (path: string) => location.pathname === path;

  const menuItems = {
    home: checkPathname(
      Pages.detailsVault({
        workspaceId: params?.workspaceId ?? '',
        vaultId: params?.vaultId ?? '',
      }),
    ),
    settings: checkPathname(
      Pages.vaultSettings({
        vaultId: params?.vaultId ?? '',
        workspaceId: current ?? '',
      }),
    ),
    transactions: checkPathname(
      Pages.transactions({
        vaultId: params?.vaultId ?? '',
        workspaceId: current ?? '',
      }),
    ),
    balance: checkPathname(
      Pages.vaultBalance({
        vaultId: params?.vaultId ?? '',
        workspaceId: current ?? '',
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
