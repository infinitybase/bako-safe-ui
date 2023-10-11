import { Avatar, AvatarGroup } from '@chakra-ui/react';

import { assetsMap, NativeAssetId } from '@/modules/core';

const Assets = () => (
  <AvatarGroup max={2}>
    <Avatar name="ETH" src={assetsMap[NativeAssetId].icon} />
  </AvatarGroup>
);

export { Assets };
