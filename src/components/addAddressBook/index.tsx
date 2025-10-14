import {
  HStack,
  Icon,
  IconButton,
  IconButtonProps,
  IconProps,
  StackProps,
  Text,
  TextProps,
} from 'bako-ui';

import { CreateContactDialog } from '@/modules/addressBook/components/dialog';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { PlusIcon } from '../icons';

interface AddAddressBookProps extends StackProps {
  address: string;
  iconButtonProps?: Omit<IconButtonProps, 'aria-label' | 'onClick'>;
  iconProps?: Omit<IconProps, 'as'>;
  textProps?: TextProps;
  hasAdd: boolean;
}

const AddAddressBook = ({
  address,
  iconButtonProps,
  iconProps,
  textProps,
  hasAdd,
  ...rest
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
      />

      {hasAdd && (
        <HStack gap={1} {...rest}>
          <IconButton
            aria-label="Add to Address Book"
            variant="plain"
            bgColor="none"
            fontSize="2xs"
            size="2xs"
            onClick={() => {
              handleOpenDialog?.({
                address,
              });
            }}
            {...iconButtonProps}
          >
            <Icon as={PlusIcon} color="grey.75" {...iconProps} />
          </IconButton>
          <Text color="grey.75" fontSize="xs" {...textProps}>
            Add to Address Book
          </Text>
        </HStack>
      )}
    </>
  );
};

export { AddAddressBook };
