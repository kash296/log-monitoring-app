/*
    - Calculates duration between start and end times in minutes
*/
function calculateDurationMinutes(startTime, endTime) {
    const [startHour, startMin, startSec] = startTime.split(':').map(Number);
    const [endHour, endMin, endSec] = endTime.split(':').map(Number);
    
    const startTotalSeconds = startHour * 3600 + startMin * 60 + startSec;
    const endTotalSeconds = endHour * 3600 + endMin * 60 + endSec;
    
    // Handle day boundary - if end time is smaller, it crossed midnight
    let durationSeconds = endTotalSeconds - startTotalSeconds;
    if (durationSeconds < 0) {
        durationSeconds += 24 * 3600; 
    }
    
    return durationSeconds / 60; 
}

/*
    - Processes jobs and generates alerts based on duration thresholds
*/
function checkJobDurations(jobMap, warningThreshold = 5, errorThreshold = 10) {
    const results = {
        warnings: [],
        errors: [],
        incomplete: []
    };
    
    for (let [pid, job] of jobMap) {
        // Check if job has both start and end times
        if (!job.startTime || !job.endTime) {
            results.incomplete.push({
                pid: job.pid,
                description: job.description,
                hasStart: !!job.startTime,
                hasEnd: !!job.endTime
            });
            continue;
        }
        
        const durationMinutes = calculateDurationMinutes(job.startTime, job.endTime);
        
        const jobResult = {
            pid: job.pid,
            description: job.description,
            startTime: job.startTime,
            endTime: job.endTime,
            duration: Math.round(durationMinutes * 100) / 100 // Round to 2 decimal places
        };
        
        if (durationMinutes > errorThreshold) {
            results.errors.push(jobResult);
        } else if (durationMinutes > warningThreshold) {
            results.warnings.push(jobResult);
        }
    }
    
    if (results.warnings.length > 0) {
        console.log('\n--- WARNINGS ---');
        results.warnings.forEach(job => {
            console.warn(`WARNING: Job ${job.pid} (${job.description}) took ${job.duration} minutes`);
        });
    }

    if (results.errors.length > 0) {
        console.log('\n--- ERRORS ---');
        results.errors.forEach(job => {
            console.error(`ERROR: Job ${job.pid} (${job.description}) took ${job.duration} minutes`);
        });
    }
    
    //If there are any incomplete jobs, we can print them out here.
    if (results.incomplete.length > 0) {
        console.log('\n--- INCOMPLETE JOBS ---');
        results.incomplete.forEach(job => {
            console.log(`INCOMPLETE: Job ${job.pid} (${job.description}) - Missing ${!job.hasStart ? 'START' : 'END'}`);
        });
    }
    
    return results;
}

export { checkJobDurations, calculateDurationMinutes };