// main.ts

import { getBestRoute } from "./getBestRoute";
import { BestRouteParams, PairMap } from "@/types/routes";

const params: BestRouteParams = {
  fromInput: 1000, // e.g., 1000 SCRT tokens
  routes: [
    ["SCRT", "sETH", "sUSDT"],
    ["SCRT", "sBTC", "sUSDT"],
  ],
  pairs: new Map([
    ["SCRT_sETH", { offer_pool: 1000000, ask_pool: 200 }],
    ["sETH_sUSDT", { offer_pool: 200, ask_pool: 400000 }],
    ["SCRT_sBTC", { offer_pool: 1000000, ask_pool: 50 }],
    ["sBTC_sUSDT", { offer_pool: 50, ask_pool: 1000000 }],
  ]),
  gasFees: [0.1, 0.2], // Assuming gas fees in the relevant units
};

const result = getBestRoute(params);
console.log(result);

/* output:

{
  bestRoute: [ "SCRT", "sBTC", "sUSDT" ],
  bestAmount: 997.803992015968,
  routeOutputs: [
    {
      route: [ "SCRT", "sETH", "sUSDT" ],
      outputAmount: 399.2015968063873,
      adjustedOutputAmount: 399.10159680638725,
    }, {
      route: [ "SCRT", "sBTC", "sUSDT" ],
      outputAmount: 998.003992015968,
      adjustedOutputAmount: 997.803992015968,
    }
  ],
}
  */
