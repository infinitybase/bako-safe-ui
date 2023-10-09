import { FormControl, FormLabel, Select, SelectProps } from '@chakra-ui/react';
import React from 'react';

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
      <Select value={props.value} onChange={props.onChange} placeholder=" ">
        <option>Select asset</option>
        {assets.map((asset) => (
          <option key={asset.assetId} value={asset.assetId}>
            {asset.slug} - {asset.name}
          </option>
        ))}
      </Select>
      <FormLabel color="gray">Asset</FormLabel>
      {props.helperText}
    </FormControl>
  );
}

export { AssetSelect };
