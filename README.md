# Cross-Chain Token Bridge

![Solidity](https://img.shields.io/badge/solidity-^0.8.20-blue)
![Infrastructure](https://img.shields.io/badge/type-bridge-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

**Cross-Chain Token Bridge** solves the isolation problem of blockchains. It uses a centralized (or federated) validator architecture to observe events on Chain A and trigger transactions on Chain B.

## Architecture

1.  **Bridge Contract (Source)**: Custodies the original tokens.
2.  **Bridge Contract (Destination)**: Has permission to Mint/Burn "Wrapped" tokens.
3.  **Validator Node (Off-Chain)**: A script that listens for `Deposit` events on Source and calls `release()` on Destination.

## Workflow

1.  **Bridge Out**: User sends Token A to Bridge on Ethereum. Bridge emits `Deposit` event.
2.  **Relay**: Validator detects event, generates a signature, and calls Destination Bridge.
3.  **Mint**: Destination Bridge mints "Wrapped Token A" to user.
4.  **Bridge Back**: User burns Wrapped Token. Validator detects event and unlocks original Token A on Ethereum.

## Usage

```bash
# 1. Install
npm install

# 2. Deploy (Simulating 2 chains on 1 network for testing)
npx hardhat run deploy.js --network localhost

# 3. Start the Bridge Node (The Validator)
node bridge_validator.js

# 4. Lock Tokens (Source Chain)
node lock_tokens.js

# 5. Observe console for automated minting!
