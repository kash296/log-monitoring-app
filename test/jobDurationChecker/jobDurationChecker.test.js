import { checkJobDurations, calculateDurationMinutes } from '#src/durationChecker';

describe('Duration Checker', () => {
    describe('calculateDurationMinutes', () => {
        test('should calculate duration correctly in same hour', () => {
            const duration = calculateDurationMinutes('11:35:23', '11:38:45');
            expect(duration).toBeCloseTo(3.37, 1);
        });
        
        test('should calculate duration across hours', () => {
            const duration = calculateDurationMinutes('11:58:30', '12:05:15');
            expect(duration).toBeCloseTo(6.75, 1);
        });
        
        test('should handle midnight crossing', () => {
            const duration = calculateDurationMinutes('23:58:00', '00:05:00');
            expect(duration).toBe(7);
        });
        
        test('should calculate exactly 5 minutes', () => {
            const duration = calculateDurationMinutes('10:00:00', '10:05:00');
            expect(duration).toBe(5);
        });
        
        test('should calculate exactly 10 minutes', () => {
            const duration = calculateDurationMinutes('10:00:00', '10:10:00');
            expect(duration).toBe(10);
        });
    });
    
    describe('checkJobDurations', () => {
        test('should generate warnings and errors correctly with strict thresholds', () => {
            const jobMap = new Map([
                ['1', { pid: '1', description: 'short job', startTime: '10:00:00', endTime: '10:02:00' }],
                ['2', { pid: '2', description: 'exactly 5 min', startTime: '10:00:00', endTime: '10:05:00' }],
                ['3', { pid: '3', description: 'warning job', startTime: '10:00:00', endTime: '10:07:00' }],
                ['4', { pid: '4', description: 'exactly 10 min', startTime: '10:00:00', endTime: '10:10:00' }],
                ['5', { pid: '5', description: 'error job', startTime: '10:00:00', endTime: '10:15:00' }],
                ['6', { pid: '6', description: 'incomplete job', startTime: '10:00:00' }]
            ]);
            
            const results = checkJobDurations(jobMap);
            
            expect(results.warnings).toHaveLength(2);
            expect(results.errors).toHaveLength(1);
            expect(results.incomplete).toHaveLength(1);
            expect(results.warnings.find(w => w.pid === '2')).toBeUndefined(); // 5 min exactly should not be warning
            expect(results.warnings.find(w => w.pid === '4')).toBeDefined(); // 10 min exactly should be warning
        });
    });
});