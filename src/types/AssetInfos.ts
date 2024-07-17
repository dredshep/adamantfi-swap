import { NativeToken } from "./NativeToken";
import { Token } from "./Token";

export type AssetInfos = {
  asset_infos: Array<NativeToken | Token>;
};
