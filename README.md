# Disperse-NFT

Disperse-NFT is a tool designed to simplify bulk WAX NFT transfers by processing recipient details from CSV files. It enables users to execute batch transfers of AtomicAssets NFTs efficiently, complete with detailed transaction feedback and logging.

## Features

- Batch process NFT transfers from CSV files
- Automatic batching of up to 15 NFTs per transaction
- Detailed transaction logging with Transaction IDs
- Built-in delay between transactions to prevent rate limiting
- Groups transfers by recipient for optimization

## Prerequisites

- Bun v1.1.8 or later
- Active WAX account with NFTs to transfer
- Private key with transfer authorization

## Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install eosjs papaparse
```

## Configuration

Update `config.js` with your values:

```javascript
export const config = {
  rpcApi: "https://wax.greymass.com",
  privateKey: "", // Your private key
  senderName: "", // Your WAX account
  contractName: "atomicassets", // Fixed for NFT transfers
  memo: "", // Optional memo for transfers
};
```

## CSV Format

Create a CSV file (e.g., `receivers.csv`) with the following structure:

```csv
receiverName,asset_id
account1,1099554645488
account1,1099550321245
account2,1099583135618
```

## Project Structure

- `config.js`: Configuration settings
- `transaction-sender.js`: Handles sending transactions
- `csv-processor.js`: Processes CSV and coordinates batch transfers
- `app.js`: Main entry point
- `logger.js`: Handles transaction logging

## Usage

1. Update configuration in `config.js`
2. Prepare your CSV file with receiver information and asset IDs
3. Run the system:

```bash
bun run app.js
```

## Success Messages

For each successful transaction, you'll see a message like:

```
Successfully transferred 15 NFTs to receiverAccount from senderAccount. Trx ID: abcd1234...
```

The system will also create a detailed log file (`nft_transfers.log`) containing:

- Batch processing information
- Individual NFT transfer details
- Any errors that occur during processing

This project was created using `bun init` in bun v1.1.8. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
