export const logger = {
  isVerbose: false,
  isSilent: false,

  debug(...msgs: unknown[]) {
    if (logger.isVerbose) console.log(...msgs);
  },
  info(...msgs: unknown[]) {
    if (logger.isVerbose || !logger.isSilent) console.log(...msgs);
  },
  error(...msgs: unknown[]) {
    console.error(...msgs);
  },
};
