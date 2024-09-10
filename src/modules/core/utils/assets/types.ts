import { ComponentWithAs, IconProps } from '@chakra-ui/react';

export type AssetMap = {
  [assetId: string]: {
    name: string;
    slug: string;
    icon?: ComponentWithAs<'svg', IconProps>;
    assetId: string;
  };
};

export type Asset = {
  name: string;
  slug: string;
  assetId: string;
  icon?: ComponentWithAs<'svg', IconProps>;
  amount?: string;
};
