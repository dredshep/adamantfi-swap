import { AssetInfos } from "@/types/AssetInfos";

export const getSymbolsFromPair = (pair: AssetInfos): string[] => {
  const symbols = [];

  if ("native_token" in pair.asset_infos[0]) {
    symbols.push(pair.asset_infos[0].native_token.denom);
  } else {
    symbols.push(pair.asset_infos[0].token.contract_addr);
  }
  if ("native_token" in pair.asset_infos[1]) {
    symbols.push(pair.asset_infos[1].native_token.denom);
  } else {
    symbols.push(pair.asset_infos[1].token.contract_addr);
  }

  return symbols;
};
