export const logger = {
  isVerbose: false,

  debug(...msgs: unknown[]) {
    if (logger.isVerbose) console.log(...msgs);
  },
  error(...msgs: unknown[]) {
    console.error(...msgs);
  },
};
