# Arbitrum Claim and Send ARB

This project is designed to claim Arbitrum (ARB) tokens from a smart contract and send them to a specified recipient address. It uses the worker_threads module to run the `claimAndSendARB` function in a separate thread and interacts with the Arbitrum blockchain using Web3.js.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 14 or higher)
- [Web3.js](https://github.com/ChainSafe/web3.js/) (version 1.x)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/codeesura/arbitrum-claim-send.git
cd arbitrum-claim-send
```

2. Install dependencies:

```bash
npm install
```

## Configuration

1. Update the `provider` variable with your Arbitrum node URL.

```javascript
const provider = 'http://your-node-url:8545/';
```

2. Set the required contract addresses and private keys in the `addresses` array. Replace the placeholder values with your actual data.

```javascript
const addresses = [
  {
    armut: 'armut',
    senderAddress: 'senderAddress',
    armutPrivateKey: 'armutPrivateKey',
    senderPrivateKey: 'senderPrivateKey',
    claimAmount: 3750,
  },
];
```

3. Update the recipient address to receive the ARB tokens.


## Usage

Run the main script:

```bash
node index.js
```

This script will monitor the blockchain and wait for a specific block number. When that block number is reached, it will start the claiming process by executing the `claimAndSendARB` function in a separate thread for each address in the addresses array.

## Results

![image](https://user-images.githubusercontent.com/120671243/227720825-cf359655-3d01-4a48-9772-f32a7a90785d.png)

https://twitter.com/codeesura/status/1639238246268907520

https://twitter.com/codeesura/status/1639366290635620355


## License

This project is licensed under the [MIT License](https://github.com/codeesura/arbitrum-claim-send/blob/main/LICENSE) - see the LICENSE file for details.
