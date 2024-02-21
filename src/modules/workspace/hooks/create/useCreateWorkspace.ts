import { useNavigate } from 'react-router-dom';

import { Pages } from '@/modules/core';
import { useTab } from '@/modules/core/hooks';
import { EnumUtils } from '@/modules/core/utils';

import { useSelectWorkspace } from '../select';
import { useWorkspace } from '../useWorkspace';
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
  const { goWorkspace } = useWorkspace();
  const tabs = useTab({
    tabs: EnumUtils.toNumberArray(CreateWorkspaceTabState),
    defaultTab: CreateWorkspaceTabState.ON_BOARDING,
  });

  const form = useCreateWorkspaceForm();
  const request = useCreateWorkspaceRequest();
  const { selectWorkspace } = useSelectWorkspace();

  const handleClose = () => navigate(Pages.home());

  const handleGoToWorkspace = () => {
    selectWorkspace(request?.data.id!, {
      onSelect: (workspace) => {
        goWorkspace(workspace.id);
      },
    });
  };

  const handleConfigureMembers = () => {
    selectWorkspace(request.data!, {
      onSelect: (workspace) => {
        navigate(Pages.membersWorkspace({ workspaceId: workspace.id }));
      },
    });
  };

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
