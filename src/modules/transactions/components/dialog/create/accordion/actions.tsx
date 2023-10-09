import {
  AccordionButton,
  HStack,
  Icon,
  IconButton,
  IconButtonProps,
  StackProps,
} from '@chakra-ui/react';
import React from 'react';

import { EditIcon, RemoveIcon } from '@/components';

const AccordionEditAction = (props: Omit<IconButtonProps, 'aria-label'>) => (
  <IconButton
    as={AccordionButton}
    p={0}
    h="auto"
    minW="auto"
    _hover={{}}
    _active={{}}
    bgColor="transparent"
    aria-label="Edit transaction"
    icon={<Icon fontSize="xl" color="grey.200" as={EditIcon} />}
    isDisabled={props.isDisabled}
    {...props}
  />
);

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

export { AccordionActions, AccordionDeleteAction, AccordionEditAction };
