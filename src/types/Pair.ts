import { NativeToken } from "./NativeToken";
import { Token } from "./Token";

export type Pair = {
  asset_infos: Array<NativeToken | Token>;
  contract_addr: string;
  liquidity_token: string;
  token_code_hash: string;
};
