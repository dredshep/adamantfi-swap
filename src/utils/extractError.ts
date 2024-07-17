import { TxResponse } from "secretjs";

export const extractError = (result: TxResponse): string => {
  // Check for slippage error in arrayLog
  console.error(JSON.stringify(result, null, 2));
  if (result?.arrayLog) {
    for (const log of result.arrayLog) {
      if (log.key === "Operation fell short of expected_return") {
        return "Swap fell short of expected return (slippage error)";
      }
    }
  }

  // Fallback to jsonLog for any other logs
  if (result?.jsonLog) {
    return JSON.stringify(result.jsonLog);
  }

  console.error(result);
  return `Unknown error`;
};
