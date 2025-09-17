import { Avatar, Skeleton } from '@chakra-ui/react';
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
      <Skeleton isLoaded={!isLoading} borderRadius={8} boxSize="36px">
        <Avatar
          variant="roundedSquare"
          borderRadius={8}
          src={avatar || member.avatar}
          key={member.address}
          border="none"
          sx={{
            '&>img': {
              border: '1px solid #CFCCC9',
              boxShadow: '4px 0px 4px 0px #2B2827E5',
            },
          }}
        />
      </Skeleton>
    );
  },
);

VaultCardMemberAvatar.displayName = 'VaultCardMemberAvatar';

export default VaultCardMemberAvatar;
