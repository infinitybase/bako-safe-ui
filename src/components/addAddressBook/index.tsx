import {
  HStack,
  Icon,
  IconButton,
  IconButtonProps,
  IconProps,
  StackProps,
  Text,
  TextProps,
} from '@chakra-ui/react';

import { CreateContactDialog } from '@/modules/addressBook/components/dialog';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { PlusIcon } from '../icons';

interface AddAddressBookProps extends StackProps {
  address: string;
  iconButtonProps?: Omit<IconButtonProps, 'aria-label' | 'onClick'>;
  iconProps?: Omit<IconProps, 'as'>;
  textProps?: TextProps;
}

const AddAddressBook = (props: AddAddressBookProps) => {
  const { address, iconButtonProps, iconProps, textProps, ...rest } = props;

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

      <HStack spacing={1} {...rest}>
        <IconButton
          aria-label="Add to Address Book"
          variant="icon"
          bgColor="none"
          fontSize="2xs"
          size="2xs"
          icon={<Icon as={PlusIcon} color="grey.75" {...iconProps} />}
          onClick={() => {
            handleOpenDialog?.({
              address,
            });
          }}
          {...iconButtonProps}
        />
        <Text color="grey.75" fontSize="xs" {...textProps}>
          Add to Address Book
        </Text>
      </HStack>
    </>
  );
};

export { AddAddressBook };
