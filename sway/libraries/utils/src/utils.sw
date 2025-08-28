library;

use std::block::height;
use interfaces::data_structures::PoolId;

pub fn check_deadline(deadline: u32) {
    require(deadline >= height(), "Deadline passed");
}

pub fn is_stable(pool_id: PoolId) -> bool {
    pool_id.2
}