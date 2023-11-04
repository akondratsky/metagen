import { logger } from './logger';
import { describe, it, expect, spyOn, afterEach, jest, afterAll } from 'bun:test';

const logSpy = spyOn(console, 'log');
const errorSpy = spyOn(console, 'error');

describe('logger', () => {
  afterEach(() => {
    logSpy.mockReset();
    errorSpy.mockReset();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('prints errors', () => {
    logger.isVerbose = false;
    logger.error('test');
    expect(errorSpy).toHaveBeenCalled();
  });

  describe('debug messages', () => {
    it('printed in verbose mode', () => {
      logger.isVerbose = true;
      logger.debug('test');
      expect(logSpy).toHaveBeenCalled();
    });
    it('not printed in verbose mode', () => {
      logger.isVerbose = false;
      logger.debug('test');
      expect(logSpy).not.toHaveBeenCalled();
    });
  });
});
