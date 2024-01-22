import { useNavigate } from 'react-router-dom';

import { useTab } from '@/modules';

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
    tabs: Object.values(TabState) as number[],
    defaultTab: TabState.ON_BOARDING,
  });
  const form = useCreateWorkspaceForm();
  const request = useCreateWorkspaceRequest();

  const handleClose = () => navigate(-1);

  /* TODO: add path to workspace */
  const handleGoToWorkspace = () => navigate(-1);

  const handleCreateWorkspace = form.handleSubmit(async (data) => {
    await request.mutateAsync({
      name: data.name,
      description: data.description,
    });

    tabs.set(TabState.SUCCESS);
  });

  return {
    request,
    handleClose,
    handleGoToWorkspace,
    form: {
      ...form,
      handleCreateWorkspace,
    },
    tabs,
  };
};

export { useCreateWorkspace };
