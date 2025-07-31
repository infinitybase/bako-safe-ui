script;

use interfaces::{data_structures::PoolId, mira_amm::MiraAMM};
use math::pool_math::get_amounts_in;
use utils::utils::check_deadline;
use std::{asset::transfer, bytes::Bytes};

configurable {
    AMM_CONTRACT_ID: ContractId = ContractId::zero(),
    BAKO_FEE: u64 = 0,
    BAKO_FEE_RECEIVER: Identity = Identity::Address(Address::zero()),
}

fn main(
    amount_out: u64,
    asset_out: AssetId,
    amount_in_max: u64,
    pools: Vec<PoolId>,
    recipient: Identity,
    deadline: u32,
) -> Vec<(u64, AssetId)> {
    check_deadline(deadline);

    let amounts_in = get_amounts_in(AMM_CONTRACT_ID, amount_out, asset_out, pools);
    let (first_amount_in, first_asset) = amounts_in.get(amounts_in.len() - 1).unwrap();
    let fee = (first_amount_in * BAKO_FEE) / 100;
    let first_amount_in_with_bako_fee = first_amount_in + fee;
    require(
        first_amount_in_with_bako_fee <= amount_in_max,
        "Exceeding input amount",
    );

    transfer(
        Identity::ContractId(AMM_CONTRACT_ID),
        first_asset,
        first_amount_in,
    );
    transfer(BAKO_FEE_RECEIVER, first_asset, fee);
    let amm = abi(MiraAMM, AMM_CONTRACT_ID.into());

    let mut i = 0;
    while i < pools.len() {
        let pool_id = pools.get(i).unwrap();
        let (amount_out, asset_out) = amounts_in.get(amounts_in.len() - i - 2).unwrap();
        let to = if i == pools.len() - 1 {
            recipient
        } else {
            Identity::ContractId(AMM_CONTRACT_ID)
        };
        let (amount_0_out, amount_1_out) = if asset_out == pool_id.0 {
            (amount_out, 0)
        } else {
            (0, amount_out)
        };
        amm.swap(pool_id, amount_0_out, amount_1_out, to, Bytes::new());
        i += 1;
    }

    amounts_in
}
