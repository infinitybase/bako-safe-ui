import { FormControl } from '@chakra-ui/react';
import React from 'react';

import { AssetSelect as Select, AssetSelectProps } from '@/components';

interface Props extends AssetSelectProps {
  helperText?: React.ReactNode;
}

function AssetSelect(props: Props) {
  const { helperText, ...rest } = props;

  return (
    <FormControl>
      <Select label="Asset" maxOptionsHeight={300} {...rest} />
      {helperText}
    </FormControl>
  );
}

export { AssetSelect };
