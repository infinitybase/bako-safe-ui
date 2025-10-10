import { HStack } from '@chakra-ui/react';
import React from 'react';

import { TransactionFilterFieldProps } from './field';

interface TransactionFilterControl {
  children: React.ReactNode;
  onChange: (value: string) => void;
  value: string;
}

const TransactionFilterControl = (props: TransactionFilterControl) => {
  const childrens = React.Children.map(props.children, (child) => {
    if (React.isValidElement<TransactionFilterFieldProps>(child)) {
      return React.cloneElement(child, {
        ...child.props,
        selectedValue: props.value,
        onChange: props.onChange,
      });
    }
  });

  return <HStack gap={7}>{childrens}</HStack>;
};

export { TransactionFilterControl };
