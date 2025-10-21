import { Icon, IconProps } from 'bako-ui';

import { CreateContactDialog } from '@/modules/addressBook/components/dialog';
import { VaultIconInfo } from '@/modules/vault/components/vaultIconInfo';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { BookmarkIcon } from '../icons';

interface AddAddressBookProps {
  address: string;
  iconProps?: Omit<IconProps, 'as'>;
  hasAdd: boolean;
}

const AddAddressBook = ({
  address,
  iconProps,
  hasAdd,
}: AddAddressBookProps) => {
  const {
    addressBookInfos: {
      dialog: { contactDialog },
      handlers: { handleOpenDialog },
      requests: { createContactRequest },
      form: contactForm,
    },
  } = useWorkspaceContext();

  return (
    <>
      <CreateContactDialog
        form={contactForm}
        dialog={contactDialog}
        isLoading={createContactRequest.isPending}
        isEdit={false}
        address={address}
      />

      {hasAdd && (
        <VaultIconInfo
          tooltipContent="Add to Address Book"
          placement="top"
          onClick={() =>
            handleOpenDialog?.({
              address,
            })
          }
        >
          <Icon as={BookmarkIcon} color="gray.200" w="12px" {...iconProps} />
        </VaultIconInfo>
      )}
    </>
  );
};

export { AddAddressBook };
