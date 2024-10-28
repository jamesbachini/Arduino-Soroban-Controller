# Arduino-Soroban: IoT Meets Blockchain 🚀

Connect your Arduino to the Stellar blockchain using Soroban smart contracts. Control hardware outputs directly from blockchain events, enabling decentralized IoT applications.

Full tutorial at: https://jamesbachini.com/arduino-soroban-smart-contract/

## 🌟 Features

- Deploy Soroban smart contracts to trigger Arduino actions
- Real-time blockchain event monitoring
- Hardware control through Johnny-Five
- Extensible for various IoT applications
- Fully decentralized control system

## 📋 Prerequisites

- Arduino Nano or compatible board
- Node.js v14+
- Rust and Cargo
- Stellar CLI tools
- USB cable for Arduino connection

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/arduino-soroban.git
cd arduino-soroban
```

2. **Install Rust dependencies**
```bash
rustup target add wasm32-unknown-unknown
cargo install --locked stellar-cli --features opt
```

3. **Install Node.js dependencies**
```bash
npm install
```

4. **Upload Firmata to Arduino**
- Open Arduino IDE
- File > Examples > Firmata > StandardFirmataPlus
- Upload to your board

## 🚀 Quick Start

1. **Build and deploy the smart contract**
```bash
cd contract
cargo build --target wasm32-unknown-unknown --release
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/arduino-soroban.wasm --source YOUR_ACCOUNT --network testnet
```

2. **Configure the controller**
- Update `controller/src/controller.js` with your contract ID and Arduino port
```javascript
const contractId = 'YOUR_CONTRACT_ID_HERE';
const board = new Board({
    port: "COM3"  // Update with your Arduino port
});
```

3. **Start the controller**
```bash
cd controller
node src/controller.js
```

4. **Trigger an action**
```bash
stellar contract invoke --id YOUR_CONTRACT_ID --source-account YOUR_ACCOUNT --network testnet -- launch
```

## 🔌 Hardware Setup

1. Connect Arduino Nano to USB port
2. LED connection:
   - Positive (longer) leg → Pin 3
   - Negative (shorter) leg → GND
3. (Optional) Add additional components as needed

## 🛠 Development

### Smart Contract

The Soroban smart contract emits events that trigger Arduino actions:

```rust
#[contractimpl]
impl ArduinoSoroban {
    pub fn launch(env: &Env) {
        env.events().publish(
            (symbol_short!("launch"),),
            1
        );
    }
}
```

### Controller

The Node.js controller monitors blockchain events and controls the Arduino:

```javascript
const processEvents = async (eventsResponse) => {
    for (const event of eventsResponse.events) {
        if (event.topic[0]._value.toString() === 'launch') {
            console.log('Launch event detected!');
            power = true;
        }
    }
};
```

## 📜 License

This project is licensed under the MIT License

## 🔗 Links

- [Soroban Documentation](https://soroban.stellar.org/)
- [Johnny-Five Documentation](http://johnny-five.io/)
- [Stellar Platform](https://www.stellar.org/)
- [Arduino Documentation](https://www.arduino.cc/)
- [Personal Website](https://jamesbachini.com)
- [YouTube](https://www.youtube.com/c/JamesBachini?sub_confirmation=1)
- [Substack](https://bachini.substack.com)
- [Podcast](https://podcasters.spotify.com/pod/show/jamesbachini)
- [Spotify](https://open.spotify.com/show/2N0D9nvdxoe9rY3jxE4nOZ)
- [Twitter](https://twitter.com/james_bachini)
- [LinkedIn](https://www.linkedin.com/in/james-bachini/)
- [GitHub](https://github.com/jamesbachini)


## ⭐ Stars!

If you find this project useful, please give it a star on GitHub! It helps others discover the project 💖