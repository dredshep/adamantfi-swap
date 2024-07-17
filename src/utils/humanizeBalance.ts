import { BigNumber } from "bignumber.js";

export const humanizeBalance = (
  balance: BigNumber,
  decimals: number
): BigNumber => balance.dividedBy(new BigNumber(`1e${decimals}`));
