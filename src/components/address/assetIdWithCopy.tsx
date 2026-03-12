import { Flex } from 'bako-ui';

import { CopyAddressButton } from '../copyAddressButton';
import { Address } from './basic';

interface AssetIdWithCopy {
  assetId: string;
}

export const AssetIdWithCopy = ({ assetId }: AssetIdWithCopy) => {
  return (
    <Flex
      minW={{ base: '105px' }}
      ml="auto"
      w="full"
      overflow="hidden"
      alignItems="center"
      gap={3}
    >
      <Address value={assetId} />

      <CopyAddressButton
        aria-label="Copy Asset Id"
        size="xs"
        minW={2}
        addressToCopy={assetId}
      />
    </Flex>
  );
};
