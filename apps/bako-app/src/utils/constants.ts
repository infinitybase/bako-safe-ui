export enum ENetworks {
  BETA_5 = 'https://beta-5.fuel.network/graphql',
  TEST_NET = 'https://testnet.fuel.network/v1/graphql',
}

export const serverApi = import.meta.env.VITE_API_URL;
