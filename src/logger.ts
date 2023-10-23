export const logger = {
  isVerbose: false,

  debug(...msgs: any[]) {
    if (logger.isVerbose) console.log(...msgs);
  },
  error(...msgs: any[]) {
    console.error(...msgs);
  },
};
