import { assets } from 'fuels';
import { Asset, AssetMap } from './types';
const ETHDefault = 'https://cdn.fuel.network/assets/eth.svg';
const NativeAssetId =
  '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07';

//   {
//     "name": "Ethereum",
//     "symbol": "ETH",
//     "icon": "https://cdn.fuel.network/assets/eth.svg",
//     "networks": [
//         {
//             "type": "ethereum",
//             "chainId": 11155111,
//             "decimals": 18
//         },
//         {
//             "type": "ethereum",
//             "chainId": 31337,
//             "decimals": 18
//         },
//         {
//             "type": "ethereum",
//             "chainId": 1,
//             "decimals": 18
//         },
//         {
//             "type": "fuel",
//             "chainId": 0,
//             "decimals": 9,
//             "assetId": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07"
//         },
//         {
//             "type": "fuel",
//             "chainId": 0,
//             "decimals": 9,
//             "assetId": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07"
//         },
//         {
//             "type": "fuel",
//             "chainId": 9889,
//             "decimals": 9,
//             "assetId": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07"
//         }
//     ]
// }

export const formatedAssets = (chainId: number): Asset[] =>
  assets.reduce<Asset[]>((acc, asset) => {
    const network = asset.networks.find(
      (network) => network && network.chainId === chainId,
    );
    if (network && network.type === 'fuel') {
      acc.push({
        name: asset.name,
        slug: asset.symbol,
        assetId: network.assetId,
        icon: asset.icon,
      });
    }
    return acc;
  }, []);

const assetsList: Asset[] = formatedAssets(
  Number(import.meta.env.VITE_CHAIN_ID),
);

const assetsMap: AssetMap = formatedAssets(
  Number(import.meta.env.VITE_CHAIN_ID),
).reduce((previousValue, currentValue) => {
  return {
    ...previousValue,
    [currentValue.assetId]: {
      name: currentValue.name,
      slug: currentValue.slug,
      icon: currentValue.icon,
      assetId: currentValue.assetId,
    },
  };
}, {});

export { assetsList, assetsMap, ETHDefault, NativeAssetId };
