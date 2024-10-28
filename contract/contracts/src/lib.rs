#![no_std]
use soroban_sdk::{contract, contractimpl, Env, symbol_short};

#[contract]
pub struct ArduinoSoroban;

#[contractimpl]
impl ArduinoSoroban {
    pub fn launch(env: &Env) {
        env.events().publish(
            (symbol_short!("launch"),),
            1 // Can be used to reference different IO ports
        );
    }
}

mod test;