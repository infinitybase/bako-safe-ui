contract;

use reentrancy::*;
use ownership::*;
use src5::{SRC5, State};
use interfaces::{data_structures::PoolId, mira_amm::MiraAMM};
use math::pool_math::{get_amounts_in, get_amounts_out};
use utils::utils::check_deadline;
use std::{
    asset::transfer,
    bytes::Bytes,
    call_frames::msg_asset_id,
    context::{
        msg_amount,
        this_balance,
    },
    logging::log,
};

configurable {
    BAKO_FEE: u64 = 0,
    INITIAL_OWNER: Identity = Identity::Address(Address::zero()),
    AMM_CONTRACT_ID: ContractId = ContractId::zero(),
}

storage {
    collected_fees: StorageMap<AssetId, u64> = StorageMap {},
}

impl SRC5 for Contract {
    #[storage(read)]
    fn owner() -> State {
        _owner()
    }
}

abi BakoSwap {
    #[storage(read, write)]
    fn initialize();

    #[storage(write)]
    fn withdraw_fee(asset: AssetId, recipient: Identity) -> u64;

    #[storage(read, write), payable]
    fn swap_exact_input(
        amount_in: u64,
        asset_in: AssetId,
        amount_out_min: u64,
        pools: Vec<PoolId>,
        recipient: Identity,
        deadline: u32,
    ) -> Vec<(u64, AssetId)>;

    #[storage(read, write), payable]
    fn swap_exact_output(
        amount_out: u64,
        asset_out: AssetId,
        amount_in_max: u64,
        pools: Vec<PoolId>,
        recipient: Identity,
        deadline: u32,
    ) -> Vec<(u64, AssetId)>;
}

#[storage(read, write)]
fn collect_swap_fee(asset: AssetId, amount_received: u64) -> u64 {
    // fee to be collected
    let fee = amount_received * BAKO_FEE / 100;

    let current_asset_fee = storage.collected_fees.get(asset).try_read().unwrap_or(0);

    storage
        .collected_fees
        .insert(asset, current_asset_fee + fee);

    fee
}

impl BakoSwap for Contract {
    #[storage(read, write)]
    fn initialize() {
        initialize_ownership(INITIAL_OWNER);
    }

    #[storage(read, write), payable]
    fn swap_exact_input(
        amount_in: u64,
        asset_in: AssetId,
        amount_out_min: u64,
        pools: Vec<PoolId>,
        recipient: Identity,
        deadline: u32,
    ) -> Vec<(u64, AssetId)> {
        reentrancy_guard();
        check_deadline(deadline);

        require(msg_asset_id() == asset_in, "Wrong asset sent");
        require(msg_amount() >= amount_in, "Insufficient amount sent");
        let last_pool = pools.get(pools.len() - 1).unwrap();
        let asset_out = if asset_in == last_pool.0 {
            last_pool.1
        } else {
            last_pool.0
        };
        let current_balance = this_balance(asset_out);

        let amounts_out = get_amounts_out(AMM_CONTRACT_ID, amount_in, asset_in, pools);
        let last_amount_out = amounts_out.get(amounts_out.len() - 1).unwrap();
        require(
            last_amount_out.0 >= amount_out_min,
            "Insufficient output amount",
        );

        transfer(Identity::ContractId(AMM_CONTRACT_ID), asset_in, amount_in);

        let amm = abi(MiraAMM, AMM_CONTRACT_ID.into());
        let this_contract = ContractId::this();

        let mut i = 0;
        while i < pools.len() {
            let pool_id = pools.get(i).unwrap();
            let (amount_out, asset_out) = amounts_out.get(i + 1).unwrap();
            let to = if i == pools.len() - 1 {
                Identity::ContractId(this_contract)
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

        let swap_amount = this_balance(asset_out) - current_balance;
        let fee = collect_swap_fee(asset_out, swap_amount);
        let amount_after_fee = swap_amount - fee;

        transfer(recipient, asset_out, amount_after_fee);

        amounts_out
    }

    #[storage(read, write), payable]
    fn swap_exact_output(
        amount_out: u64,
        asset_out: AssetId,
        amount_in_max: u64,
        pools: Vec<PoolId>,
        recipient: Identity,
        deadline: u32,
    ) -> Vec<(u64, AssetId)> {
        reentrancy_guard();
        check_deadline(deadline);

        let amounts_in = get_amounts_in(AMM_CONTRACT_ID, amount_out, asset_out, pools);
        let (first_amount_in, first_asset) = amounts_in.get(amounts_in.len() - 1).unwrap();

        require(msg_asset_id() == first_asset, "Wrong asset sent");

        let amount = msg_amount();
        let fee = (first_amount_in * BAKO_FEE) / 100;

        let first_amount_in_with_fee = first_amount_in + fee;

        require(
            amount >= first_amount_in_with_fee,
            "Insufficient amount sent",
        );
        require(
            first_amount_in_with_fee <= amount_in_max,
            "Exceeding input amount",
        );
        transfer(
            Identity::ContractId(AMM_CONTRACT_ID),
            first_asset,
            first_amount_in,
        );

        let this_contract = ContractId::this();
        let contract_identity = Identity::ContractId(this_contract);
        collect_swap_fee(first_asset, first_amount_in);

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

    #[storage(write)]
    fn withdraw_fee(asset: AssetId, recipient: Identity) -> u64 {
        only_owner();

        let fee_collected = storage.collected_fees.get(asset).try_read().unwrap_or(0);
        require(fee_collected > 0, "No fees collected for this asset");

        // Reset the fee collected for this asset
        storage.collected_fees.insert(asset, 0);

        // Transfer the collected fee to the recipient
        transfer(recipient, asset, fee_collected);
        fee_collected
    }
}
