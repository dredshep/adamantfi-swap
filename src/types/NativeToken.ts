export interface NativeToken {
  type: "native_token";
  native_token: {
    denom: string;
  };
}
