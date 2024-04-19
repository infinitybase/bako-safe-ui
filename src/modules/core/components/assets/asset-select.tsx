import { FormControl } from '@chakra-ui/react';
import React from 'react';

import { Select, SelectProps } from '@/components';
import { Asset, assetsList } from '@/modules/core';

interface Props extends SelectProps {
  assets?: Asset[];
  helperText?: React.ReactNode;
}

/*
 *
 * Example implement:
 *
 * <AssetSelect
 *     id="asset"
 *     name="asset"
 *     register={register} // Use form method
 * />
 *
 * */

function AssetSelect(props: Props) {
  //todo: remove coment with fix bug send n diferent amounts
  const assets = props.assets ?? assetsList; //!!_assets && _assets.length > 0 ? _assets : assetsList;
  return (
    <FormControl>
      <Select
        label="Asset"
        value={props.value}
        isInvalid={props.isInvalid}
        onChange={props.onChange}
        options={assets.map((asset) => ({
          label: `${asset.slug} - ${asset.name}`,
          value: asset.assetId,
        }))}
      />
      {props.helperText}
    </FormControl>
  );
}

export { AssetSelect };
