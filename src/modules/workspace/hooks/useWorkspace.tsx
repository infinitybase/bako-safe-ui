import { Icon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/react';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { MdOutlineError } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useFuelAccount } from '@/modules/auth';
import { Pages, Workspace } from '@/modules/core';
import { useNotification } from '@/modules/notification';

import { useSelectWorkspaceRequest } from './useSelectWorkspaceRequest';
import { useUserWorkspacesRequest } from './useUserWorkspacesRequest';

const { WORKSPACE, PERMISSIONS, SINGLE_WORKSPACE } = CookieName;

export type UseWorkspaceReturn = ReturnType<typeof useWorkspace>;

const useWorkspace = () => {
  const { account } = useFuelAccount();
  const workspaceDialog = useDisclosure();
  const toast = useNotification();
  const navigate = useNavigate();
  const currentCookie = CookiesConfig.getCookie(WORKSPACE);
  const currentWorkspace: Workspace = currentCookie
    ? JSON.parse(currentCookie)
    : {};
  const singleCookie = CookiesConfig.getCookie(SINGLE_WORKSPACE);
  const singleWorkspace = singleCookie
    ? JSON.parse(CookiesConfig.getCookie(SINGLE_WORKSPACE)!)
    : {};
  const userWorkspacesRequest = useUserWorkspacesRequest(account);
  const selectWorkspaceRequest = useSelectWorkspaceRequest();

  const handleWorkspaceSelection = (selectedWorkspace: Workspace) => {
    if (selectedWorkspace.id === currentWorkspace.id) {
      return;
    }

    CookiesConfig.setCookies([
      {
        name: WORKSPACE,
        value: JSON.stringify(selectedWorkspace),
      },
      {
        name: PERMISSIONS,
        value: JSON.stringify(selectedWorkspace.permissions),
      },
    ]);

    selectWorkspaceRequest.mutate(
      {
        workspace: selectedWorkspace.id,
        user: CookiesConfig.getCookie(CookieName.USER_ID)!,
      },
      {
        onSuccess: ({ workspace }) => {
          if (!workspace.single) {
            toast({
              status: 'success',
              duration: 2000,
              title: 'Selected workspace!',
              icon: (
                <Icon
                  fontSize="2xl"
                  color="brand.500"
                  as={BsFillCheckCircleFill}
                />
              ),
            });

            workspaceDialog.onClose();

            navigate(Pages.workspace({ workspaceId: workspace.id }));
          }
        },
        onError: () => {
          toast({
            status: 'error',
            duration: 4000,
            isClosable: false,
            title: 'Error!',
            description: 'Try again, please...',
            icon: <Icon fontSize="2xl" color="error.600" as={MdOutlineError} />,
          });
        },
      },
    );
  };

  return {
    currentWorkspace,
    singleWorkspace,
    userWorkspacesRequest,
    workspaceDialog,
    handleWorkspaceSelection,
  };
};

export { useWorkspace };
