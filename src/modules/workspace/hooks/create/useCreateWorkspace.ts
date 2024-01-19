import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const [tab, setTab] = useState(TabState.ON_BOARDING);

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

    setTab(TabState.SUCCESS);
  });

  return {
    request,
    handleClose,
    handleGoToWorkspace,
    form: {
      ...form,
      handleCreateWorkspace,
    },
    tabs: {
      tab,
      set: setTab,
      is: (value: TabState) => tab === value,
      tabsLength: Object.keys(TabState).filter((value) => isNaN(Number(value)))
        .length,
    },
  };
};

export { useCreateWorkspace };
