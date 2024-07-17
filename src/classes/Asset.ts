import { NativeToken } from "@/types/NativeToken";
import { SwapToken } from "@/types/SwapToken";
import { Token } from "@/types/Token";
import { TokenInfo } from "@/types/TokenInfo";

export class Asset {
  public info: Token | NativeToken;
  public symbol: string;

  public isNative(): this is NativeToken {
    return Asset._isNative(this.info);
  }

  private static _isNative(info: any): info is NativeToken {
    return "native_token" in info;
  }

  static fromSwapToken(token: SwapToken): Asset {
    let tokenInfo: TokenInfo = {
      symbol: token.symbol,
      address: token?.address,
    };

    return Asset.fromTokenInfo(tokenInfo);
  }

  static fromTokenInfo(token: TokenInfo): Asset {
    if (token.address) {
      return new Asset(token.symbol, {
        type: "token",
        token: {
          contract_addr: token.address,
          token_code_hash: token.token_code_hash || "",
          viewing_key: "",
        },
      });
    } else {
      return new Asset(token.symbol, {
        type: "native_token",
        native_token: { denom: `u${token.symbol.toLowerCase()}` },
      });
    }
  }

  constructor(symbol: string, info: Token | NativeToken) {
    this.info = info;
    this.symbol = symbol;
  }
}
