library;

use interfaces::{data_structures::PoolId, mira_amm::MiraAMM};
use utils::utils::is_stable;

const ONE_E_18: u256 = 1_000_000_000_000_000_000;
const BASIS_POINTS_DENOMINATOR: u256 = 10_000;

fn adjust(amount: u256, pow_decimals: u256) -> u256 {
    amount * ONE_E_18 / pow_decimals
}

pub fn get_amount_out(
    is_stable: bool,
    reserve_in: u256,
    reserve_out: u256,
    pow_decimals_in: u256,
    pow_decimals_out: u256,
    input_amount: u256,
) -> u256 {
    if is_stable {
        let xy: u256 = k(
            true,
            reserve_in,
            reserve_out,
            pow_decimals_in,
            pow_decimals_out,
        );
        let amount_in_adjusted = adjust(input_amount, pow_decimals_in);
        let reserve_in_adjusted = adjust(reserve_in, pow_decimals_in);
        let reserve_out_adjusted = adjust(reserve_out, pow_decimals_out);
        let y = reserve_out_adjusted - get_y(
            amount_in_adjusted + reserve_in_adjusted,
            xy,
            reserve_out_adjusted,
        );
        y * pow_decimals_out / ONE_E_18
    } else {
        input_amount * reserve_out / (reserve_in + input_amount)
    }
}

pub fn get_amount_in(
    is_stable: bool,
    reserve_in: u256,
    reserve_out: u256,
    pow_decimals_in: u256,
    pow_decimals_out: u256,
    output_amount: u256,
) -> u256 {
    if is_stable {
        let xy: u256 = k(
            true,
            reserve_in,
            reserve_out,
            pow_decimals_in,
            pow_decimals_out,
        );
        let amount_out_adjusted = adjust(output_amount, pow_decimals_out);
        let reserve_in_adjusted = adjust(reserve_in, pow_decimals_in);
        let reserve_out_adjusted = adjust(reserve_out, pow_decimals_out);
        let y = get_y(
            reserve_out_adjusted - amount_out_adjusted,
            xy,
            reserve_in_adjusted,
        ) - reserve_in_adjusted;
        rounding_up_division(y * pow_decimals_in, ONE_E_18)
    } else {
        rounding_up_division(output_amount * reserve_in, (reserve_out - output_amount))
    }
}

pub fn get_amounts_out(
    amm_contract: ContractId,
    amount_in: u64,
    asset_in: AssetId,
    pools: Vec<PoolId>,
) -> Vec<(u64, AssetId)> {
    require(pools.len() >= 1, "Router: INVALID_PATH");
    let amm = abi(MiraAMM, amm_contract.into());
    let (lp_fee_volatile, lp_fee_stable, protocol_fee_volatile, protocol_fee_stable) = amm.fees();
    let (stable_fee, volatile_fee) = (lp_fee_stable + protocol_fee_stable, lp_fee_volatile + protocol_fee_volatile);
    let mut amounts: Vec<(u64, AssetId)> = Vec::new();
    amounts.push((amount_in, asset_in));
    let mut i = 0;
    while (i < pools.len()) {
        let pool_id = pools.get(i).unwrap();
        let pool_opt = amm.pool_metadata(pool_id);
        require(pool_opt.is_some(), "Pool not present");
        let pool = pool_opt.unwrap();
        let (amount_in, asset_in) = amounts.get(i).unwrap();
        let fee = if is_stable(pool_id) {
            stable_fee
        } else {
            volatile_fee
        };
        let amount_out = if asset_in == pool_id.0 {
            get_amount_out(
                is_stable(pool_id),
                pool.reserve_0
                    .as_u256(),
                pool.reserve_1
                    .as_u256(),
                pow_decimals(pool.decimals_0),
                pow_decimals(pool.decimals_1),
                subtract_fee(amount_in, fee)
                    .as_u256(),
            )
        } else {
            get_amount_out(
                is_stable(pool_id),
                pool.reserve_1
                    .as_u256(),
                pool.reserve_0
                    .as_u256(),
                pow_decimals(pool.decimals_1),
                pow_decimals(pool.decimals_0),
                subtract_fee(amount_in, fee)
                    .as_u256(),
            )
        };
        let asset_out = if pool_id.0 == asset_in {
            pool_id.1
        } else {
            pool_id.0
        };
        amounts.push((u64::try_from(amount_out).unwrap(), asset_out));
        i += 1;
    }
    amounts
}

pub fn get_amounts_in(
    amm_contract: ContractId,
    amount_out: u64,
    asset_out: AssetId,
    pools: Vec<PoolId>,
) -> Vec<(u64, AssetId)> {
    require(pools.len() >= 1, "Router: INVALID_PATH");

    let amm = abi(MiraAMM, amm_contract.into());
    let (lp_fee_volatile, lp_fee_stable, protocol_fee_volatile, protocol_fee_stable) = amm.fees();
    let (stable_fee, volatile_fee) = (lp_fee_stable + protocol_fee_stable, lp_fee_volatile + protocol_fee_volatile);

    let mut amounts: Vec<(u64, AssetId)> = Vec::new();
    amounts.push((amount_out, asset_out));
    let mut i = 0;
    while (i < pools.len()) {
        let pool_id = pools.get(pools.len() - 1 - i).unwrap();
        let pool_opt = amm.pool_metadata(pool_id);
        require(pool_opt.is_some(), "Pool not present");
        let pool = pool_opt.unwrap();
        let (amount_out, asset_out) = amounts.get(i).unwrap();
        let fee = if is_stable(pool_id) {
            stable_fee
        } else {
            volatile_fee
        };
        let amount_in = if asset_out == pool_id.0 {
            get_amount_in(
                is_stable(pool_id),
                pool.reserve_1
                    .as_u256(),
                pool.reserve_0
                    .as_u256(),
                pow_decimals(pool.decimals_1),
                pow_decimals(pool.decimals_0),
                amount_out
                    .as_u256(),
            )
        } else {
            get_amount_in(
                is_stable(pool_id),
                pool.reserve_0
                    .as_u256(),
                pool.reserve_1
                    .as_u256(),
                pow_decimals(pool.decimals_0),
                pow_decimals(pool.decimals_1),
                amount_out
                    .as_u256(),
            )
        };

        let asset_in = if pool_id.0 == asset_out {
            pool_id.1
        } else {
            pool_id.0
        };
        let amount_in_with_fee = add_fee(u64::try_from(amount_in).unwrap(), fee);
        amounts.push((amount_in_with_fee, asset_in));
        i += 1;
    }
    amounts
}

fn k(
    is_stable: bool,
    x: u256,
    y: u256,
    pow_decimals_x: u256,
    pow_decimals_y: u256,
) -> u256 {
    if (is_stable) {
        let _x: u256 = x * ONE_E_18 / pow_decimals_x;
        let _y: u256 = y * ONE_E_18 / pow_decimals_y;
        let _a: u256 = (_x * _y) / ONE_E_18;
        let _b: u256 = ((_x * _x) / ONE_E_18 + (_y * _y) / ONE_E_18);
        return _a * _b; // x3y+y3x >= k
    } else {
        return x * y; // xy >= k
    }
}

fn f(x_0: u256, y: u256) -> u256 {
    x_0 * (y * y / ONE_E_18 * y / ONE_E_18) + (x_0 * x_0 / ONE_E_18 * x_0 / ONE_E_18) * y
}

fn d(x_0: u256, y: u256) -> u256 {
    0x3u256 * x_0 * (y * y / ONE_E_18) / ONE_E_18 + (x_0 * x_0 / ONE_E_18 * x_0 / ONE_E_18)
}

fn get_y(x_0: u256, xy: u256, y: u256) -> u256 {
    let mut y: u256 = y;
    let mut i = 0;
    while i < 255 {
        let y_prev = y;
        let k = f(x_0, y);
        if k < xy {
            let dy = (xy - k) / d(x_0, y);
            y = y + dy;
        } else {
            let dy = (k - xy) / d(x_0, y);
            y = y - dy;
        }
        if y > y_prev {
            if y - y_prev <= 0x1u256 {
                return y;
            }
        } else {
            if y_prev - y <= 0x1u256 {
                return y;
            }
        }
        i += 1;
    }
    y
}

fn pow_decimals(decimals: u8) -> u256 {
    10.as_u256().pow(decimals.into())
}

fn subtract_fee(amount: u64, fee: u64) -> u64 {
    amount - calculate_fee_to_subtract(amount, fee)
}

fn calculate_fee_to_subtract(amount: u64, feeBP: u64) -> u64 {
    let nominator = amount.as_u256() * feeBP.as_u256();
    let fee = rounding_up_division(nominator, BASIS_POINTS_DENOMINATOR);
    u64::try_from(fee).unwrap()
}

fn rounding_up_division(nominator: u256, denominator: u256) -> u256 {
    let rounding_down_division_result = nominator / denominator;
    if nominator % denominator == 0 {
        rounding_down_division_result
    } else {
        rounding_down_division_result + 1
    }
}

fn calculate_fee_to_add(amount: u64, feeBP: u64) -> u64 {
    let nominator = amount.as_u256() * feeBP.as_u256();
    let denominator = BASIS_POINTS_DENOMINATOR - feeBP.as_u256();
    let fee = rounding_up_division(nominator, denominator);
    u64::try_from(fee).unwrap()
}

fn add_fee(amount: u64, fee: u64) -> u64 {
    amount + calculate_fee_to_add(amount, fee)
}
