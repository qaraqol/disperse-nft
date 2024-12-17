import { config } from "./config.js";
import { processNFTTransfersFromCSV } from "./csv-processor.js";

async function main() {
  try {
    await processNFTTransfersFromCSV("receivers.csv", config);
  } catch (error) {
    console.error("Failed to process NFT transfers:", error);
  }
}

main();
