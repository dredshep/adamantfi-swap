import fullPoolsData from './fullPoolsData.json';
import { SwapPair } from "@/types/SwapPair";
import { NativeToken } from "@/types/NativeToken";
import { Token } from "@/types/Token";
import { Asset } from "@/types/Asset";
import { PairMap } from "@/types/PairMap";

export const createPairMap = (): PairMap => {
  return fullPoolsData.reduce((acc: PairMap, pool) => {
    const assets = pool.query_result.assets.map(asset => asset.info.token || asset.info.native_token);
    if (assets.length === 2) {
      const symbol0 = assets[0].contract_addr || assets[0].denom;
      const symbol1 = assets[1].contract_addr || assets[1].denom;
      const asset0 = assets[0].contract_addr 
        ? { contract_addr: assets[0].contract_addr, token_code_hash: assets[0].token_code_hash } as Token 
        : { denom: assets[0].denom } as NativeToken;
      const asset1 = assets[1].contract_addr 
        ? { contract_addr: assets[1].contract_addr, token_code_hash: assets[1].token_code_hash } as Token 
        : { denom: assets[1].denom } as NativeToken;

      const pair_identifier = `${symbol0}${SwapPair.id_delimiter}${symbol1}`;
      const swapPair = new SwapPair(
        symbol0,
        asset0,
        symbol1,
        asset1,
        pool.contract_address,
        pool.lp_token_contract,
        pair_identifier
      );
      acc.set(pair_identifier, swapPair);
    }
    return acc;
  }, new Map<string, SwapPair>());
};
