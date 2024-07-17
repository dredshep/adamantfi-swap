import fullPoolsData from "@/outputs/fullPoolsData.json";

interface NormalToken {
  contract_addr: string;
  token_code_hash: string;
}

interface NativeToken {
  denom: string;
}

type TokenInfo = NormalToken | NativeToken;

const isNormalToken = (tokenInfo: TokenInfo): tokenInfo is NormalToken => {
  return (tokenInfo as NormalToken).contract_addr !== undefined;
};

const isNativeToken = (tokenInfo: TokenInfo): tokenInfo is NativeToken => {
  return (tokenInfo as NativeToken).denom !== undefined;
};

const getTokenByAddress = (address: string): TokenInfo | undefined => {
  return fullPoolsData
    .flatMap((pool) => pool.query_result.assets)
    .map((asset) => asset.info.token || asset.info.native_token)
    .find((tokenInfo) => {
      if (isNormalToken(tokenInfo)) {
        return tokenInfo.contract_addr === address;
      }
      if (isNativeToken(tokenInfo)) {
        return tokenInfo.denom === address;
      }
      return false;
    });
};

export default getTokenByAddress;

// console.log(getTokenByAddress("secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek"));
