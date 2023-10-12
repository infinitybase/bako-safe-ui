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
import React from 'react';

import { EditIcon, RemoveIcon } from '@/components';

const AccordionEditAction = () => {
  const { onOpen, isOpen } = useAccordionItemState();

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
      onClick={onOpen}
    >
      <AccordionButton />
    </IconButton>
  );
};

const AccordionConfirmAction = (props: ButtonProps) => {
  const { onClose } = useAccordionItemState();

  return (
    <Button
      maxW="fit-content"
      variant="secondary"
      bgColor="dark.100"
      border="none"
      onClick={onClose}
      _hover={{}}
      {...props}
    >
      Confirm recipient
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

const AccordionActions = ({ children, ...rest }: StackProps) => (
  <HStack spacing={4} {...rest}>
    {children}
  </HStack>
);

export {
  AccordionActions,
  AccordionConfirmAction,
  AccordionDeleteAction,
  AccordionEditAction,
};
