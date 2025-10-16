import { Pages } from '@/modules/core';
import { useTab } from '@/modules/core/hooks';
import { EnumUtils } from '@/modules/core/utils';

import { useWorkspaceContext } from '../../hooks';
import { useCreateWorkspaceForm } from './useCreateWorkspaceForm';
import { useCreateWorkspaceRequest } from './useCreateWorkspaceRequest';

export type UseCreateWorkspace = ReturnType<typeof useCreateWorkspace>;

export enum CreateWorkspaceTabState {
  ON_BOARDING,
  FORM,
  SUCCESS,
}

type UserCreateWorkspaceParams = {
  handleCancel: () => void;
  onClose: () => void;
};

const useCreateWorkspace = (props: UserCreateWorkspaceParams) => {
  const {
    workspaceInfos: {
      handlers: { handleWorkspaceSelection },
    },
  } = useWorkspaceContext();
  const tabs = useTab({
    tabs: EnumUtils.toNumberArray(CreateWorkspaceTabState),
    defaultTab: CreateWorkspaceTabState.ON_BOARDING,
  });

  const form = useCreateWorkspaceForm();
  const request = useCreateWorkspaceRequest();

  const onCancel = () => {
    tabs.set(CreateWorkspaceTabState.ON_BOARDING);
  };

  const handleGoToWorkspace = () => {
    handleWorkspaceSelection(
      request?.data!.id,
      Pages.workspace({ workspaceId: request?.data!.id }),
    );
  };

  const handleConfigureMembers = () => {
    handleWorkspaceSelection(
      request?.data!.id,
      Pages.membersWorkspace({ workspaceId: request?.data!.id }),
    );
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
    onCancel,
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
