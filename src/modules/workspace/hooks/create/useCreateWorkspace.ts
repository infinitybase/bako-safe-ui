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

  const [tab, setTab] = useState(TabState.FORM);

  const form = useCreateWorkspaceForm();
  const request = useCreateWorkspaceRequest();

  const handleClose = () => navigate(-1);

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
    form: {
      ...form,
      handleCreateWorkspace,
    },
    tabs: {
      tab,
      set: setTab,
      isForm: tab === TabState.FORM,
      tabsLength: Object.keys(TabState).filter((value) => isNaN(Number(value)))
        .length,
    },
  };
};

export { useCreateWorkspace };
