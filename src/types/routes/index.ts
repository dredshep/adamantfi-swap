export type Token = string;
export type Route = Token[];
export type LiquidityPool = { offer_pool: number; ask_pool: number };
export type PairMap = Map<string, LiquidityPool>;
export type GasFees = number[];

export interface BestRouteParams {
  fromInput?: number;
  toInput?: number;
  routes: Route[];
  pairs: PairMap;
  gasFees: GasFees;
}

export interface RouteOutput {
  route: Route;
  outputAmount: number;
  adjustedOutputAmount: number;
}

export interface BestRouteResult {
  bestRoute: Route | null;
  bestAmount: number;
  routeOutputs: RouteOutput[];
}
