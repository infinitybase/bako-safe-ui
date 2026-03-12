import { Heading, HStack, Icon } from 'bako-ui';
import { memo, useMemo } from 'react';

import { IconTooltipButton } from '@/components';
import { EyeCloseIcon } from '@/components/icons/eye-close';
import { EyeOpenIcon } from '@/components/icons/eye-open';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import CreateNewAccountButton from '../CreateNewAccountButton';
import ViewAllButton from '../ViewAllButton';

const RecentVaultsHeader = memo(() => {
  const {
    authDetails: { userInfos },
    workspaceInfos: {
      infos: { visibleBalance },
      handlers: { setVisibleBalance },
    },
  } = useWorkspaceContext();

  const workspaceId = useMemo(
    () => userInfos.workspace?.id ?? '',
    [userInfos.workspace?.id],
  );
  const EyeIcon = visibleBalance ? EyeOpenIcon : EyeCloseIcon;

  const handleToggleBalanceVisibility = () => {
    setVisibleBalance(!visibleBalance);
  };

  return (
    <HStack w="full" justifyContent="space-between">
      <Heading color="textPrimary" fontSize="sm" fontWeight="semibold">
        My accounts
      </Heading>

      <HStack flex={1} gap={3} justifyContent="flex-end">
        <IconTooltipButton
          tooltipContent={visibleBalance ? 'Hide Balance' : 'Show Balance'}
          buttonProps={{
            boxSize: '32px',
            minW: '32px',
            borderRadius: '6px',
            bg: 'gray.700',
          }}
          onClick={handleToggleBalanceVisibility}
        >
          <Icon
            as={EyeIcon}
            color="gray.200"
            w={visibleBalance ? '16px' : '12px'}
          />
        </IconTooltipButton>
        <CreateNewAccountButton />
        <ViewAllButton workspaceId={workspaceId} />
      </HStack>
    </HStack>
  );
});

RecentVaultsHeader.displayName = 'RecentVaultsHeader';

export default RecentVaultsHeader;
