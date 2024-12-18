# Disperse-NFT

Disperse-NFT is a versatile tool for bulk WAX NFT transfers, supporting both direct NFT transfers and template-based distributions. It handles batch transfers efficiently with detailed logging and transaction feedback.

## Features

- Two transfer modes:
  - Direct NFT transfers (specific asset IDs)
  - Template-based transfers (distribute NFTs from a specific template)
- Automatic batching of up to 15 NFTs per transaction
- Detailed transaction logging with Transaction IDs
- Built-in delay between transactions to prevent rate limiting
- Group transfers by recipient for optimization
- Atomic Assets API integration for template-based transfers

## Prerequisites

- Bun v1.1.8 or later
- Active WAX account with NFTs to transfer
- Private key with transfer authorization
- Basic understanding of WAX NFTs and AtomicAssets

## Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/disperse-nft.git
cd disperse-nft
```

2. Install dependencies:

```bash
bun install eosjs papaparse
```

## Configuration

Update `config.js` with your values:

```javascript
export const config = {
  rpcApi: "https://wax.greymass.com",
  atomicApi: "https://atomic-wax.qaraqol.com",
  privateKey: "", // Your private key
  senderName: "", // Your WAX account
  contractName: "atomicassets", // Fixed for NFT transfers
  memo: "", // Optional memo for transfers
  useTemplateMode: false, // Toggle between template mode and direct NFT transfer mode
  // Template mode specific settings (only needed if useTemplateMode is true)
  collection_name: "farmersworld",
  template_id: "260676",
};
```

### Configuration Options Explained:

- `useTemplateMode`: Set to `true` for template-based transfers, `false` for direct NFT transfers
- `collection_name`: The name of the NFT collection (required for template mode)
- `template_id`: The specific template ID to distribute NFTs from (required for template mode)

## CSV Format

### Direct NFT Transfers (useTemplateMode: false)

Create `receivers.csv` with the following structure:

```csv
receiverName,asset_id
account1,1099554645488
account1,1099550321245
account2,1099583135618
```

Each row represents a single NFT transfer with its specific asset ID.

### Template-based Transfers (useTemplateMode: true)

Create `template_receivers.csv` with the following structure:

```csv
receiverName,amount
account1,5
account2,10
```

Each row specifies how many NFTs from the template should be sent to each receiver.

## Usage

1. Configure your settings:

   - Edit `config.js` with your WAX account details
   - Set `useTemplateMode` according to your needs
   - If using template mode, set `collection_name` and `template_id`

2. Prepare your CSV file:

   - For direct transfers: Create `receivers.csv`
   - For template transfers: Create `template_receivers.csv`

3. Run the system:

```bash
bun run app.js
```

4. Monitor the logs:
   - Direct transfers: Check `nft_transfers.log`
   - Template transfers: Check `template_transfers.log`

### Example Usage

#### Direct NFT Transfers:

1. Set in config.js:

```javascript
useTemplateMode: false;
```

2. Create receivers.csv:

```csv
receiverName,asset_id
user1.wam,1099554645488
user2.wam,1099550321245
```

3. Run:

```bash
bun run app.js
```

#### Template-based Transfers:

1. Set in config.js:

```javascript
useTemplateMode: true,
collection_name: "farmersworld",
template_id: "260676"
```

2. Create template_receivers.csv:

```csv
receiverName,amount
user1.wam,5
user2.wam,3
```

3. Run:

```bash
bun run app.js
```

## Success Messages

### Direct NFT Transfers:

```
Successfully transferred 15 NFTs to receiverAccount from senderAccount. Trx ID: abcd1234...
```

### Template-based Transfers:

```
Found 100 available assets
Successfully processed batch for receiverAccount. Transaction ID: abcd1234...
Transferred NFT ID: 1099554645488 to receiverAccount
```

## Logging

The system maintains detailed logs in two separate files:

- `nft_transfers.log`: Logs for direct NFT transfers
- `template_transfers.log`: Logs for template-based transfers

Each log entry includes:

- Timestamp
- Transaction details
- Success/failure status
- Transaction IDs
- Any errors that occur

## Troubleshooting

Common issues and solutions:

1. "No assets found for the specified template"

   - Verify the template_id and collection_name are correct
   - Confirm you own NFTs of the specified template

2. "Failed to process batch"

   - Check your WAX account has sufficient resources (CPU/NET)
   - Verify the private key has proper permissions

3. "Not enough assets available"
   - Verify you have sufficient NFTs for the requested transfers
   - Check if NFTs are not locked or staked

This project was created using `bun init` in bun v1.1.8. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
