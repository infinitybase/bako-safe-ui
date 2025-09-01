const GarageAPI_URL = import.meta.env.VITE_GARAGE_API_URL;
const GarageUI_URL = import.meta.env.VITE_GARAGE_UI_URL;
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useProvider } from '@fuels/react';
import { AiOutlineShareAlt } from 'react-icons/ai';

import { CopyIcon } from '@/components';
import { TwitterXIcon } from '@/components/icons/twitter-x-icon';
import { useContactToast } from '@/modules/addressBook';

import { twitterLink } from '../utils/formatter';
import { Networks, resolveNetwork } from '../utils/resolver-network';
import { shortenUrl } from '../utils/shortenUrl';
import { slugify } from '../utils/slugify';

export default function ShareOrder({
  orderId,
  nftName,
  collectionName,
}: {
  orderId: string;
  nftName: string;
  collectionName: string;
}) {
  const slugifiedCollectionName = slugify(collectionName);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { successToast } = useContactToast();
  const { provider } = useProvider();
  const chainId =
    provider?.url?.includes('mainnet') || !provider
      ? Networks.MAINNET
      : Networks.TESTNET;

  const network = resolveNetwork(chainId).toLowerCase();

  const twitterCardUrl = `${GarageAPI_URL}/${network}/orders/s/${orderId}`;
  const orderLink = `${GarageUI_URL}/collection/${slugifiedCollectionName}/order/${orderId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(orderLink);
    successToast({
      title: 'Link copied',
      description: 'The sale link has been copied to your clipboard.',
    });
    onClose();
  };

  return (
    <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="top-end">
      <MenuButton>
        <AiOutlineShareAlt />
      </MenuButton>
      <MenuList bg="input.600" rounded="lg" borderColor="grey.600">
        <MenuItem
          bg="input.600"
          cursor="pointer"
          icon={<TwitterXIcon fontSize="md" />}
          onClick={async () => {
            const shortUrl = await shortenUrl(twitterCardUrl);
            window.open(
              twitterLink(shortUrl, {
                title: `Just listed my ${nftName} on @garagedotzone. Grab it here:`,
                related: [],
              }),
            );
          }}
        >
          <Text>Share on X</Text>
        </MenuItem>
        <MenuDivider />
        <MenuItem
          bg="input.600"
          cursor="pointer"
          icon={<CopyIcon fontSize="md" />}
          onClick={handleCopyLink}
        >
          <Text>Copy sale link</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
