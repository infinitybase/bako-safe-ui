import { useNavigate } from 'react-router-dom';

import { EnumUtils, Pages, useTab } from '@/modules';

import { useCreateWorkspaceForm } from './useCreateWorkspaceForm';
import { useCreateWorkspaceRequest } from './useCreateWorkspaceRequest';

export type UseCreateWorkspace = ReturnType<typeof useCreateWorkspace>;

export enum TabState {
  ON_BOARDING,
  FORM,
  SUCCESS,
}

const useCreateWorkspace = () => {
  const navigate = useNavigate();
  const tabs = useTab({
    tabs: EnumUtils.toNumberArray(TabState),
    defaultTab: TabState.ON_BOARDING,
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
        onSuccess: () => tabs.set(TabState.SUCCESS),
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
