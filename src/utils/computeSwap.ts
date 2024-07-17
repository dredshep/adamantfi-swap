import { COMMISSION_RATE } from "@/constants/COMMISSION_RATE";
import BigNumber from "bignumber.js";

export const compute_swap = (
  offer_pool: BigNumber,
  ask_pool: BigNumber,
  offer_amount: BigNumber
): {
  return_amount: BigNumber;
  spread_amount: BigNumber;
  commission_amount: BigNumber;
} => {
  // offer => ask
  // ask_amount = (ask_pool - cp / (offer_pool + offer_amount)) * (1 - commission_rate)
  const cp = offer_pool.multipliedBy(ask_pool);
  let return_amount = ask_pool.minus(
    cp.multipliedBy(new BigNumber(1).dividedBy(offer_pool.plus(offer_amount)))
  );

  // calculate spread & commission
  const spread_amount = offer_amount
    .multipliedBy(ask_pool.dividedBy(offer_pool))
    .minus(return_amount);
  const commission_amount = return_amount.multipliedBy(COMMISSION_RATE);

  // commission will be absorbed to pool
  return_amount = return_amount.minus(commission_amount);

  return { return_amount, spread_amount, commission_amount };
};
