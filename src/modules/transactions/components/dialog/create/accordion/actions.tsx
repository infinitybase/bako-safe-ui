import {
  Accordion,
  Button,
  ButtonProps,
  HStack,
  Icon,
  IconButton,
  IconButtonProps,
  StackProps,
  useAccordionItemContext,
} from 'bako-ui';
import { memo } from 'react';

import { CheckIcon, RemoveIcon } from '@/components';
import { EditIcon } from '@/components/icons/edit-icon';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

type AccordionActionProp = Pick<
  ButtonProps,
  'onClick' | 'disabled' | 'loading'
>;

const AccordionEditAction = memo((props: AccordionActionProp) => {
  const { expanded } = useAccordionItemContext();

  if (expanded) return null;

  return (
    <IconButton
      p={0}
      h="auto"
      minW="auto"
      _hover={{}}
      _active={{}}
      bgColor="transparent"
      aria-label="Edit transaction"
      onClick={props.onClick}
    >
      <Icon w={6} color="grey.200" as={EditIcon} />
    </IconButton>
  );
});

AccordionEditAction.displayName = 'AccordionEditAction';

const AccordionConfirmAction = memo((props: AccordionActionProp) => {
  const { expanded } = useAccordionItemContext();

  return (
    <Button
      maxW="fit-content"
      bgColor="brand.500"
      border="none"
      p={2}
      borderRadius={6}
      size="sm"
      onClick={props.onClick}
      _hover={{
        opacity: !props.disabled ? 0.8 : 1,
      }}
      hidden={!expanded}
      {...props}
    >
      <Accordion.ItemTrigger asChild>
        <Icon fontSize="sm" color="dark.950" as={CheckIcon} />
      </Accordion.ItemTrigger>
    </Button>
  );
});

AccordionConfirmAction.displayName = 'AccordionConfirmAction';

const AccordionDeleteAction = memo(
  (props: Omit<IconButtonProps, 'aria-label'>) => (
    <IconButton
      p={0}
      h="auto"
      minW="auto"
      _hover={{}}
      _active={{}}
      bgColor="transparent"
      aria-label="Remove transaction"
      {...props}
    >
      <Icon w={6} color="grey.200" as={RemoveIcon} />
    </IconButton>
  ),
);

AccordionDeleteAction.displayName = 'AccordionDeleteAction';

const AccordionActions = memo(({ children, ...rest }: StackProps) => {
  const {
    screenSizes: { isExtraSmall },
  } = useWorkspaceContext();
  return (
    <HStack
      gap={4}
      w={isExtraSmall ? 'full' : 'unset'}
      justifyContent={isExtraSmall ? 'space-between' : 'unset'}
      {...rest}
    >
      {children}
    </HStack>
  );
});

AccordionActions.displayName = 'AccordionActions';

export {
  AccordionActions,
  AccordionConfirmAction,
  AccordionDeleteAction,
  AccordionEditAction,
};
