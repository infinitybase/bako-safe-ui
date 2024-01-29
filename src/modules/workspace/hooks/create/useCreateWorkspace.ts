import { useNavigate } from 'react-router-dom';

import { Pages } from '@/modules/core';
import { useTab } from '@/modules/core/hooks';
import { EnumUtils } from '@/modules/core/utils';

import { useCreateWorkspaceForm } from './useCreateWorkspaceForm';
import { useCreateWorkspaceRequest } from './useCreateWorkspaceRequest';

export type UseCreateWorkspace = ReturnType<typeof useCreateWorkspace>;

export enum CreateWorkspaceTabState {
  ON_BOARDING,
  FORM,
  SUCCESS,
}

const useCreateWorkspace = () => {
  const navigate = useNavigate();

  const tabs = useTab({
    tabs: EnumUtils.toNumberArray(CreateWorkspaceTabState),
    defaultTab: CreateWorkspaceTabState.ON_BOARDING,
  });

  const form = useCreateWorkspaceForm();
  const request = useCreateWorkspaceRequest();

  const handleClose = () => navigate(-1);

  const handleGoToWorkspace = () =>
    navigate(Pages.workspace({ workspaceId: request.data!.id }));

  const handleConfigureMembers = () =>
    navigate(Pages.membersWorkspace({ workspaceId: request.data!.id }));

  const handleCreateWorkspace = form.handleSubmit(async (data) => {
    request.mutate(
      {
        name: data.name,
        description: data.description,
      },
      {
        onSuccess: () => tabs.set(CreateWorkspaceTabState.SUCCESS),
      },
    );
  });

  return {
    request,
    handleClose,
    handleGoToWorkspace,
    handleConfigureMembers,
    form: {
      ...form,
      handleCreateWorkspace,
    },
    tabs,
  };
};

export { useCreateWorkspace };
