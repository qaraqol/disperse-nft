export const config = {
  rpcApi: "https://wax.greymass.com",
  atomicApi: "https://atomic-wax.qaraqol.com",
  privateKey: "",
  senderName: "",
  contractName: "atomicassets",
  memo: "",
  useTemplateMode: false, // Toggle between template mode and direct NFT transfer mode
  // Template mode specific settings
  collection_name: "farmersworld", // Only used if useTemplateMode is true i.e.farmersworld
  template_id: "260676", // Only used if useTemplateMode is true i.e. farmerscoin
};
