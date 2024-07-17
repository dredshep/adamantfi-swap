export type SwapTokenMap = Map<string, SwapToken>;

export type SwapToken = {
  symbol: string;
  logo?: string;
  identifier?: string;
  decimals?: number;
  address?: string;
  name?: string;
  balance?: string;
  price?: number;
};
