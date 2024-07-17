import { StdFee } from "secretjs/dist/wallet_amino";

const gasPriceUscrt = 0.25;
export function getFeeForExecute(gas: number): StdFee {
  return {
    amount: [
      {
        amount: String(Math.floor(gas * gasPriceUscrt) + 1),
        denom: "uscrt",
      },
    ],
    gas: String(gas),
  };
}
