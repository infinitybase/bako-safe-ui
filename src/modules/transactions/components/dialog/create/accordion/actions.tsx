import {
  AccordionButton,
  AccordionButtonProps,
  HStack,
  Icon,
  IconButton,
  IconButtonProps,
  StackProps,
} from '@chakra-ui/react';
import React from 'react';

import { EditIcon, RemoveIcon } from '@/components';

const AccordionEditAction = (props: AccordionButtonProps) => (
  <AccordionButton p={0} {...props}>
    <EditIcon
      fontSize="xl"
      opacity={props.disabled ? '0.4' : 1}
      color="grey.200"
    />
  </AccordionButton>
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
