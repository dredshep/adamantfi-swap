export const sleep = (duration: number | undefined) =>
  new Promise((res) => setTimeout(res, duration));
