import { Avatar, Skeleton } from 'bako-ui';
import { memo } from 'react';

import { PredicateMember } from '@/modules/core';
import { useBakoIdAvatar } from '@/modules/core/hooks/bako-id';
import { useNetworks } from '@/modules/network/hooks';

const VaultCardMemberAvatar = memo(
  ({ member }: { member: PredicateMember }) => {
    const { currentNetwork } = useNetworks();
    const { avatar, isLoading } = useBakoIdAvatar(
      member.address,
      currentNetwork.chainId,
    );

    return (
      <Skeleton loading={isLoading} borderRadius={8} boxSize="36px">
        <Avatar
          shape="rounded"
          borderRadius={8}
          key={member.address}
          border="none"
          css={{
            '&>img': {
              border: '1px solid #CFCCC9',
              boxShadow: '4px 0px 4px 0px #2B2827E5',
            },
          }}
          name={member.nickname || member.address}
          src={avatar || member.avatar}
        />
      </Skeleton>
    );
  },
);

VaultCardMemberAvatar.displayName = 'VaultCardMemberAvatar';

export default VaultCardMemberAvatar;
