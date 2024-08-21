import {
  AccordionButton,
  Button,
  ButtonProps,
  HStack,
  Icon,
  IconButton,
  IconButtonProps,
  StackProps,
  useAccordionItemState,
} from '@chakra-ui/react';

import { RemoveIcon } from '@/components';
import { EditIcon } from '@/components/icons/edit-icon';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

type AccordionActionProp = Pick<
  ButtonProps,
  'onClick' | 'isDisabled' | 'isLoading'
>;

const AccordionEditAction = (props: AccordionActionProp) => {
  const { isOpen } = useAccordionItemState();

  return (
    <IconButton
      p={0}
      h="auto"
      minW="auto"
      _hover={{}}
      _active={{}}
      bgColor="transparent"
      aria-label="Edit transaction"
      icon={<Icon fontSize="xl" color="grey.200" as={EditIcon} />}
      isDisabled={isOpen}
      onClick={props.onClick}
    >
      <AccordionButton />
    </IconButton>
  );
};

const AccordionConfirmAction = (props: AccordionActionProp) => {
  const { isOpen } = useAccordionItemState();

  return (
    <Button
      maxW="fit-content"
      bgColor="brand.500"
      border="none"
      isDisabled={props.isDisabled}
      onClick={props.onClick}
      _hover={{
        opacity: !props.isDisabled && 0.8,
      }}
      hidden={!isOpen}
      isLoading={props.isLoading}
      {...props}
    >
      Confirm
      <AccordionButton hidden />
    </Button>
  );
};

const AccordionDeleteAction = (props: Omit<IconButtonProps, 'aria-label'>) => (
  <IconButton
    p={0}
    h="auto"
    minW="auto"
    _hover={{}}
    _active={{}}
    bgColor="transparent"
    aria-label="Remove transaction"
    icon={<Icon fontSize="xl" color="grey.200" as={RemoveIcon} />}
    {...props}
  />
);

const AccordionActions = ({ children, ...rest }: StackProps) => {
  const {
    screenSizes: { isExtraSmall },
  } = useWorkspaceContext();
  return (
    <HStack
      spacing={4}
      w={isExtraSmall ? 'full' : 'unset'}
      justifyContent={isExtraSmall ? 'space-between' : 'unset'}
      {...rest}
    >
      {children}
    </HStack>
  );
};

export {
  AccordionActions,
  AccordionConfirmAction,
  AccordionDeleteAction,
  AccordionEditAction,
};
