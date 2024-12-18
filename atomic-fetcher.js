export async function fetchTemplateAssets(config, limit = 100, page = 1) {
  const { atomicApi, collection_name, template_id, senderName } = config;

  try {
    const response = await fetch(
      `${atomicApi}/atomicassets/v1/assets?collection_name=${collection_name}&template_id=${template_id}&owner=${senderName}&page=${page}&limit=${limit}&order=desc&sort=asset_id`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data.map((asset) => asset.asset_id);
  } catch (error) {
    throw new Error(`Failed to fetch assets: ${error.message}`);
  }
}

export async function getAllTemplateAssets(config) {
  let allAssets = [];
  let page = 1;
  const limit = 100;

  while (true) {
    const assets = await fetchTemplateAssets(config, limit, page);
    if (assets.length === 0) break;

    allAssets = allAssets.concat(assets);
    page++;

    // Add a small delay to prevent rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return allAssets;
}
