library;

/// (asset_0, asset_1, is_stable)
pub type PoolId = (AssetId, AssetId, bool);

pub struct Asset {
    pub id: AssetId,
    pub amount: u64,
}

pub struct PoolMetadata {
    pub reserve_0: u64,
    pub reserve_1: u64,
    pub liquidity: Asset,
    pub decimals_0: u8,
    pub decimals_1: u8,
}