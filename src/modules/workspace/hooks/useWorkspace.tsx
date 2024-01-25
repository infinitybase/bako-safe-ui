import { Icon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { MdOutlineError } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useFuelAccount } from '@/modules/auth';
import {
  Pages,
  PermissionRoles,
  Predicate,
  Transaction,
  Workspace,
} from '@/modules/core';
import { useNotification } from '@/modules/notification';

import { useSelectWorkspaceRequest } from './useSelectWorkspaceRequest';
import { useUserWorkspacesRequest } from './useUserWorkspacesRequest';

const { WORKSPACE, PERMISSIONS, SINGLE_WORKSPACE, USER_ID } = CookieName;

export type UseWorkspaceReturn = ReturnType<typeof useWorkspace>;

// TODO: Remove when request is done
const workspaceVaults: Predicate[] = [
  {
    id: 'd0da4178-5358-44c4-b5b9-d90745099e08',
    createdAt: '2024-01-23T18:09:17.769Z',
    deletedAt: null,
    updatedAt: '2024-01-23T18:09:17.769Z',
    name: 'nove',
    predicateAddress:
      'fuel1uk2zrx4s0qd6qxd4v0762x0pcu32nffc0yt6nt2u054lxkamwrgsefa3mf',
    description: 'null',
    minSigners: 1,
    configurable:
      '{"HASH_PREDICATE":[3,2,10,8,6,4,0,10,3,10,4,6,6,8,7,4,6,6,1,2],"SIGNATURES_COUNT":1,"SIGNERS":["0xa93f9266642877a7e441dee3051c51adea9f488512b91fe8bcd77603e0b9b81c","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"],"network":"https://beta-4.fuel.network/graphql","chainId":0}',
    provider: 'https://beta-4.fuel.network/graphql',
    chainId: 3215,
    owner: {
      id: '1e252c27-bae4-4a27-9e75-2a19a9bae838',
      address:
        'fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8',
    },
    workspace: {
      id: '46810d14-f456-4b4e-9018-2c16abb61354',
    },
    members: [
      {
        id: '1e252c27-bae4-4a27-9e75-2a19a9bae838',
        address:
          'fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8',
        avatar: 'https://app.bsafe.pro/icons/16965892304737.png',
      },
    ],
  },
  {
    id: 'a6563961-0703-4ded-a5a3-293f05e9e546',
    createdAt: '2024-01-23T18:09:09.630Z',
    deletedAt: null,
    updatedAt: '2024-01-23T18:09:09.630Z',
    name: 'oito',
    predicateAddress:
      'fuel10hn6su6vt9l3sphtk2uynvxvpzrm6q6e460nr0kd224lnh07sttsy744tx',
    description: null,
    minSigners: 1,
    configurable:
      '{"HASH_PREDICATE":[4,7,6,3,5,0,2,8,2,6,0,2,7,9,9,5,2,3,4,8],"SIGNATURES_COUNT":1,"SIGNERS":["0xa93f9266642877a7e441dee3051c51adea9f488512b91fe8bcd77603e0b9b81c","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"],"network":"https://beta-4.fuel.network/graphql","chainId":0}',
    provider: 'https://beta-4.fuel.network/graphql',
    chainId: null,
    owner: {
      id: '1e252c27-bae4-4a27-9e75-2a19a9bae838',
      address:
        'fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8',
    },
    workspace: {
      id: '46810d14-f456-4b4e-9018-2c16abb61354',
    },
    members: [
      {
        id: '1e252c27-bae4-4a27-9e75-2a19a9bae838',
        address:
          'fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8',
        avatar: 'https://app.bsafe.pro/icons/16965892304737.png',
      },
    ],
  },
  {
    id: '287fe1ca-6852-4c5f-9910-d5a33e843059',
    createdAt: '2024-01-23T18:08:59.849Z',
    deletedAt: null,
    updatedAt: '2024-01-23T18:08:59.849Z',
    name: 'sete',
    predicateAddress:
      'fuel1s36gncatjx2zxsnsqnfh25pu88f977nm7m66azhmky0a7etjp8ws0az97n',
    description: null,
    minSigners: 1,
    configurable:
      '{"HASH_PREDICATE":[9,8,9,2,5,9,6,7,6,3,3,4,4,3,4,5,2,1,4,7],"SIGNATURES_COUNT":1,"SIGNERS":["0xa93f9266642877a7e441dee3051c51adea9f488512b91fe8bcd77603e0b9b81c","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"],"network":"https://beta-4.fuel.network/graphql","chainId":0}',
    provider: 'https://beta-4.fuel.network/graphql',
    chainId: null,
    owner: {
      id: '1e252c27-bae4-4a27-9e75-2a19a9bae838',
      address:
        'fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8',
    },
    workspace: {
      id: '46810d14-f456-4b4e-9018-2c16abb61354',
    },
    members: [
      {
        id: '1e252c27-bae4-4a27-9e75-2a19a9bae838',
        address:
          'fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8',
        avatar: 'https://app.bsafe.pro/icons/16965892304737.png',
      },
    ],
  },
  {
    id: 'eb99476f-3cc0-4bba-b031-e1e2089029d0',
    createdAt: '2024-01-23T18:08:54.710Z',
    deletedAt: null,
    updatedAt: '2024-01-23T18:08:54.710Z',
    name: 'seis',
    predicateAddress:
      'fuel145n3smdur5dfhq6q5nl7sxqa0tzq7st88jq3ch5v3tprpw0nwp8s3ztttp',
    description: null,
    minSigners: 1,
    configurable:
      '{"HASH_PREDICATE":[9,4,8,3,9,6,2,8,8,1,2,4,2,3,4,5,5,10,2,9],"SIGNATURES_COUNT":1,"SIGNERS":["0xa93f9266642877a7e441dee3051c51adea9f488512b91fe8bcd77603e0b9b81c","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"],"network":"https://beta-4.fuel.network/graphql","chainId":0}',
    provider: 'https://beta-4.fuel.network/graphql',
    chainId: null,
    owner: {
      id: '1e252c27-bae4-4a27-9e75-2a19a9bae838',
      address:
        'fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8',
    },
    workspace: {
      id: '46810d14-f456-4b4e-9018-2c16abb61354',
    },
    members: [
      {
        id: '1e252c27-bae4-4a27-9e75-2a19a9bae838',
        address:
          'fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8',
        avatar: 'https://app.bsafe.pro/icons/16965892304737.png',
      },
    ],
  },
  {
    id: 'd3cc43bc-2573-4bad-a595-c8095cd2fb7b',
    createdAt: '2024-01-23T18:08:40.251Z',
    deletedAt: null,
    updatedAt: '2024-01-23T18:08:40.251Z',
    name: 'cinco',
    predicateAddress:
      'fuel1rhvndxgkp6sxu8p0lrcs57fk04stmz39ynjtydyvha8zr30ym3mssype6h',
    description: null,
    minSigners: 1,
    configurable:
      '{"HASH_PREDICATE":[6,6,8,10,1,7,6,5,10,4,4,1,4,4,5,8,9,2,4,1],"SIGNATURES_COUNT":1,"SIGNERS":["0xa93f9266642877a7e441dee3051c51adea9f488512b91fe8bcd77603e0b9b81c","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"],"network":"https://beta-4.fuel.network/graphql","chainId":0}',
    provider: 'https://beta-4.fuel.network/graphql',
    chainId: null,
    owner: {
      id: '1e252c27-bae4-4a27-9e75-2a19a9bae838',
      address:
        'fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8',
    },
    workspace: {
      id: '46810d14-f456-4b4e-9018-2c16abb61354',
    },
    members: [
      {
        id: '1e252c27-bae4-4a27-9e75-2a19a9bae838',
        address:
          'fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8',
        avatar: 'https://app.bsafe.pro/icons/16965892304737.png',
      },
    ],
  },
  {
    id: '268dc54d-5672-49a5-a22e-d5f1a89e76d0',
    createdAt: '2024-01-23T18:08:33.236Z',
    deletedAt: null,
    updatedAt: '2024-01-23T18:08:33.236Z',
    name: 'quatro',
    predicateAddress:
      'fuel1akpu3qm4hsdh7kkfvpxpnche679dmc0xc0dh5xy3e9d4p4uphqfqu7q6uj',
    description: null,
    minSigners: 1,
    configurable:
      '{"HASH_PREDICATE":[5,8,0,7,5,6,1,5,2,7,7,2,2,9,4,4,3,3,6,3],"SIGNATURES_COUNT":1,"SIGNERS":["0xa93f9266642877a7e441dee3051c51adea9f488512b91fe8bcd77603e0b9b81c","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"],"network":"https://beta-4.fuel.network/graphql","chainId":0}',
    provider: 'https://beta-4.fuel.network/graphql',
    chainId: null,
    owner: {
      id: '1e252c27-bae4-4a27-9e75-2a19a9bae838',
      address:
        'fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8',
    },
    workspace: {
      id: '46810d14-f456-4b4e-9018-2c16abb61354',
    },
    members: [
      {
        id: '1e252c27-bae4-4a27-9e75-2a19a9bae838',
        address:
          'fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8',
        avatar: 'https://app.bsafe.pro/icons/16965892304737.png',
      },
    ],
  },
  {
    id: 'a0f484a9-73e7-4bde-ad7e-05755d78ce97',
    createdAt: '2024-01-23T18:08:26.169Z',
    deletedAt: null,
    updatedAt: '2024-01-23T18:08:26.169Z',
    name: 'tres',
    predicateAddress:
      'fuel1y4wpcm9kup6sangpj4kcja39c0k8vl3p26hptt2yvfxwt9msxx0sp8ycvs',
    description: null,
    minSigners: 1,
    configurable:
      '{"HASH_PREDICATE":[5,2,4,7,5,10,9,2,3,4,7,8,4,9,1,5,9,1,7,9],"SIGNATURES_COUNT":1,"SIGNERS":["0xa93f9266642877a7e441dee3051c51adea9f488512b91fe8bcd77603e0b9b81c","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"],"network":"https://beta-4.fuel.network/graphql","chainId":0}',
    provider: 'https://beta-4.fuel.network/graphql',
    chainId: null,
    owner: {
      id: '1e252c27-bae4-4a27-9e75-2a19a9bae838',
      address:
        'fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8',
    },
    workspace: {
      id: '46810d14-f456-4b4e-9018-2c16abb61354',
    },
    members: [
      {
        id: '1e252c27-bae4-4a27-9e75-2a19a9bae838',
        address:
          'fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8',
        avatar: 'https://app.bsafe.pro/icons/16965892304737.png',
      },
    ],
  },
  {
    id: '46666f41-b2e8-4b86-891e-513c80bd506d',
    createdAt: '2024-01-23T18:08:05.187Z',
    deletedAt: null,
    updatedAt: '2024-01-23T18:08:05.187Z',
    name: 'dois',
    predicateAddress:
      'fuel12sgft2mmv2knyueh5df2p4ptdjjpf4crk025g5p8sxkhhu0hnsmq8p5e3c',
    description: null,
    minSigners: 1,
    configurable:
      '{"HASH_PREDICATE":[2,2,6,8,3,1,10,6,9,0,2,1,5,9,0,7,9,7,9,3],"SIGNATURES_COUNT":1,"SIGNERS":["0xa93f9266642877a7e441dee3051c51adea9f488512b91fe8bcd77603e0b9b81c","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"],"network":"https://beta-4.fuel.network/graphql","chainId":0}',
    provider: 'https://beta-4.fuel.network/graphql',
    chainId: null,
    owner: {
      id: '1e252c27-bae4-4a27-9e75-2a19a9bae838',
      address:
        'fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8',
    },
    workspace: {
      id: '46810d14-f456-4b4e-9018-2c16abb61354',
    },
    members: [
      {
        id: '1e252c27-bae4-4a27-9e75-2a19a9bae838',
        address:
          'fuel14yleyeny9pm60ezpmm3s28z34h4f7jy9z2u3l69u6amq8c9ehqwq43wts8',
        avatar: 'https://app.bsafe.pro/icons/16965892304737.png',
      },
    ],
  },
];

const workspaceTransactions: Transaction[] = [];

const useWorkspace = () => {
  const [visibleBalance, setVisibleBalance] = useState(false);
  const { account } = useFuelAccount();
  const workspaceDialog = useDisclosure();
  const toast = useNotification();
  const navigate = useNavigate();
  const singleCookie = CookiesConfig.getCookie(SINGLE_WORKSPACE);
  const currentCookie = CookiesConfig.getCookie(WORKSPACE);
  const permissionsCookie = CookiesConfig.getCookie(PERMISSIONS);
  const currentWorkspace: Workspace = currentCookie
    ? JSON.parse(currentCookie)
    : {};
  const currentPermissions: Workspace = permissionsCookie
    ? JSON.parse(permissionsCookie)
    : {};
  const singleWorkspace = singleCookie
    ? JSON.parse(CookiesConfig.getCookie(SINGLE_WORKSPACE)!)
    : {};
  const userWorkspacesRequest = useUserWorkspacesRequest();
  const selectWorkspaceRequest = useSelectWorkspaceRequest();

  const vaultsPerPage = 8;

  // TODO: Keep first one after request is implemented
  // const vaultsCounter = workspaceVaultsRequest?.data?.total ?? 0;
  const vaultsCounter = 9;

  const handleWorkspaceSelection = (selectedWorkspace: Workspace) => {
    if (selectedWorkspace.id === currentWorkspace.id) {
      return;
    }

    // TODO: Validate if this setter is necessary
    CookiesConfig.setCookies([
      {
        name: WORKSPACE,
        value: JSON.stringify(selectedWorkspace),
      },
      {
        name: PERMISSIONS,
        value: JSON.stringify(
          selectedWorkspace.permissions[CookiesConfig.getCookie(USER_ID)!],
        ),
      },
    ]);

    selectWorkspaceRequest.mutate(
      {
        workspace: selectedWorkspace.id,
        user: CookiesConfig.getCookie(USER_ID)!,
      },
      {
        onSuccess: ({ workspace }) => {
          console.log('🚀 ~ handleWorkspaceSelection ~ workspace:', workspace);
          // CookiesConfig.setCookies([
          //   {
          //     name: WORKSPACE,
          //     value: JSON.stringify(workspace),
          //   },
          //   {
          //     name: PERMISSIONS,
          //     value: JSON.stringify(workspace.permissions),
          //   },
          // ]);

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

  const hasPermission = (requiredRoles: PermissionRoles[]) => {
    const isValid =
      requiredRoles.filter((p) => currentPermissions[p].includes('*')).length >
      0;
    return isValid;
  };

  return {
    account,
    currentWorkspace,
    singleWorkspace,
    userWorkspacesRequest,
    workspaceDialog,
    handleWorkspaceSelection,
    navigate,
    workspaceVaults: {
      // TODO: Keep first option after workspaceVaultsRequest is implemented
      // recentVaults: workspaceVaultsRequest.data?.data,
      recentVaults: workspaceVaults,
      vaultsMax: vaultsPerPage,
      extraCount:
        vaultsCounter <= vaultsPerPage ? 0 : vaultsCounter - vaultsPerPage,
    },
    workspaceTransactions: {
      // TODO: Keep first option after workspaceVaultsRequest is implemented
      // recentTransactions: workspaceTransactionsRequest.data?.data,
      recentTransactions: workspaceTransactions,
    },
    currentPermissions,
    hasPermission,
    visibleBalance,
    setVisibleBalance,
  };
};

export { useWorkspace };
