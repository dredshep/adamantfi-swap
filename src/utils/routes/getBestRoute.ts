import {
  BestRouteParams,
  BestRouteResult,
  Route,
  LiquidityPool,
  RouteOutput,
} from "@/types/routes";

function getOfferAmount(pool: LiquidityPool, amount: number): number {
  const { offer_pool, ask_pool } = pool;
  return (amount * ask_pool) / (offer_pool + amount);
}

function getRequiredAmount(pool: LiquidityPool, amount: number): number {
  const { offer_pool, ask_pool } = pool;
  return (amount * offer_pool) / (ask_pool - amount);
}

export function getBestRoute(params: BestRouteParams): BestRouteResult {
  const { fromInput, toInput, routes, pairs, gasFees } = params;

  const calculateRouteOutput = (
    route: Route,
    amount: number,
    direction: "forward" | "reverse"
  ): number => {
    let resultAmount = amount;
    const steps =
      direction === "forward" ? route.slice(0, -1) : route.slice(1).reverse();

    for (let i = 0; i < steps.length; i++) {
      const fromToken =
        direction === "forward" ? route[i] : route[route.length - 1 - i];
      const toToken =
        direction === "forward" ? route[i + 1] : route[route.length - 2 - i];
      const pool = pairs.get(`${fromToken}_${toToken}`);
      if (!pool) return 0;

      resultAmount =
        direction === "forward"
          ? getOfferAmount(pool, resultAmount)
          : getRequiredAmount(pool, resultAmount);
    }

    return resultAmount;
  };

  const routeOutputs: RouteOutput[] = routes.map((route, index) => {
    const initialAmount = fromInput ?? toInput!;
    const direction = fromInput !== undefined ? "forward" : "reverse";
    const outputAmount = calculateRouteOutput(route, initialAmount, direction);
    const adjustedOutputAmount =
      direction === "forward"
        ? outputAmount - gasFees[index]
        : outputAmount + gasFees[index];

    return { route, outputAmount, adjustedOutputAmount };
  });

  const bestRouteOutput = routeOutputs.reduce((best, current) => {
    const isBetter =
      fromInput !== undefined
        ? current.adjustedOutputAmount > best.adjustedOutputAmount
        : current.adjustedOutputAmount < best.adjustedOutputAmount;
    return isBetter ? current : best;
  }, routeOutputs[0]);

  return {
    bestRoute: bestRouteOutput.route,
    bestAmount: bestRouteOutput.adjustedOutputAmount,
    routeOutputs,
  };
}
