import { useMutation } from 'react-query';

import { WorkspaceService } from '@/modules/workspace/services';

const useChangeMemberRequest = () =>
  useMutation('workspace/update/members', WorkspaceService.updateMembers);

export { useChangeMemberRequest };
