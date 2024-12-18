// nft-processor.js
import { parse } from "papaparse";
import { sendTransaction } from "./transaction-sender.js";
import { createLogger } from "./logger.js";

export async function processNFTTransfersFromCSV(filePath, config) {
  const logger = createLogger("nft_transfers.log");
  const fileContent = await Bun.file(filePath).text();

  parse(fileContent, {
    header: true,
    dynamicTyping: false, // Keep as string since asset_ids are large numbers
    skipEmptyLines: true,
    complete: async (results) => {
      const records = results.data;
      const batchSize = 15;

      logger.log(
        `Starting to process ${records.length} NFT transfers in batches of ${batchSize}`
      );

      // Group records by receiver
      const groupedByReceiver = records.reduce((acc, record) => {
        if (!acc[record.receiverName]) {
          acc[record.receiverName] = [];
        }
        acc[record.receiverName].push(record.asset_id);
        return acc;
      }, {});

      // Convert grouped records to batch-sized transactions
      const transfers = Object.entries(groupedByReceiver).flatMap(
        ([receiver, asset_ids]) => {
          const batches = [];
          for (let i = 0; i < asset_ids.length; i += batchSize) {
            batches.push({
              receiver,
              asset_ids: asset_ids.slice(i, i + batchSize),
            });
          }
          return batches;
        }
      );

      // Process each batch
      for (let i = 0; i < transfers.length; i++) {
        const transfer = transfers[i];
        logger.log(
          `Processing batch ${i + 1} of ${transfers.length} for receiver ${
            transfer.receiver
          }`
        );

        const transaction = {
          actions: [
            {
              account: config.contractName,
              name: "transfer",
              authorization: [
                {
                  actor: config.senderName,
                  permission: "active",
                },
              ],
              data: {
                from: config.senderName,
                to: transfer.receiver,
                asset_ids: transfer.asset_ids,
                memo: config.memo,
              },
            },
          ],
        };

        try {
          const result = await sendTransaction({
            rpcApi: config.rpcApi,
            privateKey: config.privateKey,
            transaction,
          });

          logger.log(
            `Successfully processed batch ${i + 1}. Transaction ID: ${
              result.transaction_id
            }`
          );
          transfer.asset_ids.forEach((asset_id) => {
            logger.log(
              `Transferred NFT ID: ${asset_id} to ${transfer.receiver}`
            );
          });

          if (i < transfers.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch (error) {
          logger.error(
            `Failed to process batch ${i + 1} for ${transfer.receiver}`,
            error
          );
          transfer.asset_ids.forEach((asset_id) => {
            logger.log(
              `Failed to transfer NFT ID: ${asset_id} to ${transfer.receiver}`
            );
          });
        }
      }

      logger.log("Finished processing all NFT transfers");
    },
    error: (error) => {
      logger.error("Error parsing CSV", error);
    },
  });
}
