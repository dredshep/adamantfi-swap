import { Pair } from "@/types/Pair";
import { SwapTokenMap } from "@/types/SwapToken";
import { SecretNetworkClient } from "secretjs";
import { getSymbolsFromPair } from "../utils/getSymbolsFromPair";
import { Asset } from "./Asset";
import { NativeToken } from "@/types/NativeToken";
import { Token } from "@/types/Token";

export class SwapPair {
  pair_identifier: string;
  asset_infos: Asset[];
  contract_addr: string;
  liquidity_token: string;
  static id_delimiter = "/" as const;

  constructor(
    symbol0: string,
    asset0: NativeToken | Token,
    symbol1: string,
    asset1: NativeToken | Token,
    contract_addr: string,
    liquidity_token: string,
    pair_identifier: string
  ) {
    this.asset_infos = [];
    this.asset_infos.push(new Asset(symbol0, asset0));
    this.asset_infos.push(new Asset(symbol1, asset1));
    this.contract_addr = contract_addr;
    this.liquidity_token = liquidity_token;
    this.pair_identifier = pair_identifier;
  }

  lpTokenSymbol(): string {
    return `LP-${this.identifier()}`;
  }

  identifier(): string {
    return this.pair_identifier;
  }

  assetIds(): string[] {
    return this.pair_identifier.split(SwapPair.id_delimiter);
  }

  isSymbolInPair(symbol: string): boolean {
    return (
      symbol.toUpperCase() === this.asset_infos[0].symbol ||
      symbol.toUpperCase() === this.asset_infos[1].symbol
    );
  }

  humanizedSymbol(): string {
    return `${this.asset_infos[0].symbol}-${this.asset_infos[1].symbol}`;
  }

  isIdInPair(id: string): boolean {
    const pairIdentifiers = this.pair_identifier.split(SwapPair.id_delimiter);

    for (const pId of pairIdentifiers) {
      if (pId.toLowerCase() === id) {
        return true;
      }
    }

    return false;
  }

  static fromPair(pair: Pair, tokenMap: SwapTokenMap) {
    const identifiers = getSymbolsFromPair(pair);

    const symbol0 = tokenMap.get(identifiers[0])?.symbol;
    const symbol1 = tokenMap.get(identifiers[1])?.symbol;

    if (!symbol0 || !symbol1) {
      throw new Error(
        "Failed to get token symbols for pair: " + JSON.stringify(pair)
      );
    }

    const pair_identifier = pairIdFromTokenIds(identifiers[0], identifiers[1]);

    //const symbol0 = asset0.type === 'native_token' ? asset0.native_token.denom : asset0.token.contract_addr;
    return new SwapPair(
      symbol0,
      pair.asset_infos[0],
      symbol1,
      pair.asset_infos[1],
      pair.contract_addr,
      pair.liquidity_token,
      pair_identifier
    );
  }

  private static code_hash: string;
  static getPairCodeHash(
    pair_address: string,
    secretjs: SecretNetworkClient
  ): Promise<string> {
    // TODO fix this if we ever have a factory with multiple pair_code_id
    // For now this is the best way to avoid a lot of secretjs requests
    return new Promise(async (accept, reject) => {
      try {
        if (!SwapPair.code_hash) {
          const hashResponse =
            await secretjs.query.compute.codeHashByContractAddress({
              contract_address: pair_address,
            });
          if (!hashResponse.code_hash) {
            throw new Error(
              "Failed to get code hash from contract: " + pair_address
            );
          }
          SwapPair.code_hash = hashResponse.code_hash;
        }
        accept(SwapPair.code_hash);
      } catch (e) {
        reject(e);
      }
    });
  }
}

export const pairIdFromTokenIds = (id0: string, id1: string): string => {
  return id0.localeCompare(id1) === -1
    ? `${id0}${SwapPair.id_delimiter}${id1}`
    : `${id1}${SwapPair.id_delimiter}${id0}`;
};
export type PairMap = Map<string, SwapPair>;
