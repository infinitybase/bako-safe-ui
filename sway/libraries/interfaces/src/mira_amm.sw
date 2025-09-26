library;


use std::{bytes::Bytes};
use ::data_structures::{PoolId, PoolMetadata};

abi MiraAMM {
    #[payable]
    #[storage(read, write)]
    fn swap(
        pool_id: PoolId,
        amount_0_out: u64,
        amount_1_out: u64,
        to: Identity,
        data: Bytes,
    );

    #[storage(read)]
    fn fees() -> (u64, u64, u64, u64);

    #[storage(read)]
    fn pool_metadata(pool_id: PoolId) -> Option<PoolMetadata>;
}
