// __tests__/utils/logger.test.ts
import { logger, LogLevel } from '@/lib/utils/logger';

describe('Logger', () => {
    it('should log messages correctly', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        logger.log(LogLevel.INFO, 'Test message');
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('INFO: Test message'));
        consoleSpy.mockRestore();
    });
});
