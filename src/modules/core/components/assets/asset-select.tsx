import { FormControl } from '@chakra-ui/react';
import React from 'react';

import { Select, SelectProps } from '@/components';

interface Props extends SelectProps {
  helperText?: React.ReactNode;
}

function AssetSelect(props: Props) {
  const { helperText, ...rest } = props;

  return (
    <FormControl>
      <Select variant="dark" label="Asset" maxOptionsHeight={120} {...rest} />
      {helperText}
    </FormControl>
  );
}

export { AssetSelect };
