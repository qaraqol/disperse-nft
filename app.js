import { config } from "./config.js";
import { processTemplateTransfersFromCSV } from "./template-processor.js";
import { processNFTTransfersFromCSV } from "./nft-processor.js";

async function main() {
  try {
    const csvFile = config.useTemplateMode
      ? "template_receivers.csv"
      : "receivers.csv";
    const processor = config.useTemplateMode
      ? processTemplateTransfersFromCSV
      : processNFTTransfersFromCSV;

    console.log(
      `Starting in ${config.useTemplateMode ? "template" : "direct NFT"} mode`
    );
    await processor(csvFile, config);
  } catch (error) {
    console.error("Failed to process NFT transfers:", error);
  }
}

main();
