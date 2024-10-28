#![cfg(test)]

use super::*;
use soroban_sdk::{Env};

#[test]
fn test_operations() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ArduinoSoroban);
    let client = ArduinoSorobanClient::new(&env, &contract_id);
    client.launch();
}
