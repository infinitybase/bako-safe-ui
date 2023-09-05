import { FormControl, FormLabel, Select } from '@chakra-ui/react';

import { Asset, assetsList } from '@/modules/core';

interface Props {
  register: any;
  name: string;
  id: string;
  assets?: Asset[];
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

function AssetSelect({ register, name, id, assets: _assets }: Props) {
  //todo: remove coment with fix bug send n diferent amounts
  const assets = assetsList; //!!_assets && _assets.length > 0 ? _assets : assetsList;
  return (
    <FormControl>
      <FormLabel color="gray">Asset</FormLabel>
      <Select
        id={id}
        variant="filled"
        bg="dark.100"
        color="gray"
        {...register(name, { required: true })}
        _hover={{}}
      >
        <option>Select asset</option>
        {assets.map((asset) => (
          <option key={asset.assetId} value={asset.assetId}>
            {asset.slug} - {asset.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

export { AssetSelect };
