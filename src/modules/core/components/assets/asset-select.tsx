import { Field } from 'bako-ui';
import React from 'react';

import { AssetSelect as Select, AssetSelectProps } from '@/components';

interface Props extends AssetSelectProps {
  helperText?: React.ReactNode;
}

function AssetSelect(props: Props) {
  const { helperText, ...rest } = props;

  return (
    <Field.Root>
      <Select label="Asset" {...rest} />
      {helperText}
    </Field.Root>
  );
}

export { AssetSelect };
