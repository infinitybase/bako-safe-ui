import { HStack } from '@chakra-ui/react';
import React from 'react';

import { TransactionFilterFieldProps } from '@/modules/transactions/components/filter/field';

interface NotificationsFilterControl {
  children: React.ReactNode;
  onChange: (value: string) => void;
  value: string;
}

const NotificationsFilterControl = (props: NotificationsFilterControl) => {
  const childrens = React.Children.map(props.children, (child) => {
    if (React.isValidElement<TransactionFilterFieldProps>(child)) {
      return React.cloneElement(child, {
        ...child.props,
        selectedValue: props.value,
        onChange: props.onChange,
      });
    }
  });

  return <HStack spacing={7}>{childrens}</HStack>;
};

export { NotificationsFilterControl };
