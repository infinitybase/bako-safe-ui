import { useCallback } from 'react';

import { IUserInfosWorkspace } from '@/modules/auth/services';
import { PermissionRoles } from '@/modules/core/models/workspace';

import { IVaultEvent } from './useTransactionSocket';

const useHasPermissionToCreateTransaction = () => {
  const hasPermission = useCallback(
    (userWorkspace?: IUserInfosWorkspace, vault?: IVaultEvent) => {
      if (!userWorkspace || !vault) return false;

      const permissions = userWorkspace.permission;

      const isUserWorkspaceValid = vault.workspace_id === userWorkspace.id;
      const isOwner = permissions?.[PermissionRoles.OWNER]?.includes('*');
      const isAdmin = permissions?.[PermissionRoles.ADMIN]?.includes('*');
      const isManager = permissions?.[PermissionRoles.MANAGER]?.includes('*');
      const isSigner = permissions?.[PermissionRoles.SIGNER]?.includes(
        vault.id,
      );

      return (
        isUserWorkspaceValid && (isOwner || isAdmin || isManager || isSigner)
      );
    },
    [],
  );

  return {
    hasPermission,
  };
};

export { useHasPermissionToCreateTransaction };
