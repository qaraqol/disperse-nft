// template-processor.js
import { parse } from "papaparse";
import { sendTransaction } from "./transaction-sender.js";
import { createLogger } from "./logger.js";
import { getAllTemplateAssets } from "./atomic-fetcher.js";

export async function processTemplateTransfersFromCSV(filePath, config) {
  const logger = createLogger("template_transfers.log");
  const fileContent = await Bun.file(filePath).text();

  // First, fetch all available assets of the template
  logger.log(
    `Fetching assets for template ${config.template_id} from collection ${config.collection_name}`
  );
  const availableAssets = await getAllTemplateAssets(config);
  logger.log(`Found ${availableAssets.length} available assets`);

  if (availableAssets.length === 0) {
    logger.error(
      "No assets found for the specified template",
      new Error("No assets available")
    );
    return;
  }
  let assetIndex = 0;
  parse(fileContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const records = results.data;
      const batchSize = 15;

      logger.log(
        `Starting to process ${records.length} template transfer requests`
      );

      // Process each receiver's request
      for (const record of records) {
        const { receiverName, amount } = record;

        if (assetIndex + amount > availableAssets.length) {
          logger.error(
            `Not enough assets available for ${receiverName}`,
            new Error(
              `Requested: ${amount}, Available: ${
                availableAssets.length - assetIndex
              }`
            )
          );
          continue;
        }

        // Split the transfer into batches if needed
        for (let i = 0; i < amount; i += batchSize) {
          const currentBatchSize = Math.min(batchSize, amount - i);
          const assetIds = availableAssets.slice(
            assetIndex,
            assetIndex + currentBatchSize
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
                  to: receiverName,
                  asset_ids: assetIds,
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
              `Successfully processed batch for ${receiverName}. Transaction ID: ${result.transaction_id}`
            );
            assetIds.forEach((asset_id) => {
              logger.log(`Transferred NFT ID: ${asset_id} to ${receiverName}`);
            });

            assetIndex += currentBatchSize;

            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (error) {
            logger.error(`Failed to process batch for ${receiverName}`, error);
            assetIds.forEach((asset_id) => {
              logger.log(
                `Failed to transfer NFT ID: ${asset_id} to ${receiverName}`
              );
            });
          }
        }
      }

      logger.log("Finished processing all template transfers");
    },
    error: (error) => {
      logger.error("Error parsing CSV", error);
    },
  });
}
