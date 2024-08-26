enum AssetId {
  BTC = 'BTC',
  ETH = 'ETH',
  USDC = 'USDC',
  UNI = 'UNI',
  DAI = 'DAI',
  sETH = 'sETH',
}

const tokensIDS = {
  [AssetId.BTC]:
    '0x38e4ca985b22625fff93205e997bfc5cc8453a953da638ad297ca60a9f2600bc',
  [AssetId.ETH]:
    '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
  [AssetId.USDC]:
    '0x336b7c06352a4b736ff6f688ba6885788b3df16e136e95310ade51aa32dc6f05',
  [AssetId.UNI]:
    '0xb3238af388ac05188e342b1801db79d358e4a162734511316c937b00c8687fe9',
  [AssetId.DAI]:
    '0x0d9be25f6bef5c945ce44db64b33da9235fbf1a9f690298698d899ad550abae1',
  [AssetId.sETH]:
    '0x1bdeed96ee1e5eca0bd1d7eeeb51d03b0202c1faf764fec1b276ba27d5d61d89',
};

export { AssetId, tokensIDS };
