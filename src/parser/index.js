const fs = require("fs");

/*
    - Parses a single CSV log line into an object
*/

function parseLogLine(line) {
    const parts = line.split(',');
    
    if (parts.length !== 4) {
        throw new Error(`Invalid log line format: ${line}`);
    }

    return {
        timestamp: parts[0].trim(),
        description: parts[1].trim(),
        status: parts[2].trim(),
        pid: parts[3].trim()
    };
}

/*
    - Reads and parses the entire log file into a Map organized by PID
    - The file contents are split by line and then parsed into an object, which is then added to the Map
    - If a duplicate START time or END time is found for a given job PID, the previous value is overwritten
*/

function parseLogFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const lines = fileContent.split('\n').filter(line => line.trim() !== '');
        
        const jobMap = new Map();
        //Tracks the number of lines which are skipped in case the line has an invalid format.
        let skippedLines = 0;
        
        lines.forEach((line, index) => {
            try {
                const entry = parseLogLine(line);
                
                if (!jobMap.has(entry.pid)) {
                    jobMap.set(entry.pid, { pid: entry.pid, description: entry.description });
                }
                
                const job = jobMap.get(entry.pid);
                
                //If there is an already existing start time for a job, it will overwrite the previous value.
                if (entry.status === 'START') {
                    if (job.startTime) {
                        console.warn(`Duplicate START found for PID ${entry.pid}, overwriting previous start time`);
                    }
                    job.startTime = entry.timestamp;
                } else if (entry.status === 'END') {
                    //If there is an already existing end time for a job, it will overwrite the previous value.
                    if (job.endTime) {
                        console.warn(`Duplicate END found for PID ${entry.pid}, overwriting previous end time`);
                    }
                    job.endTime = entry.timestamp;
                }
            } catch (error) {
                //If the line has an invalid format, it will be skipped.
                console.warn(`Skipping line ${index + 1}: ${line} - ${error.message}`);
                skippedLines++;
            }
        });
        
        if (skippedLines > 0) {
            console.log(`Processed ${lines.length - skippedLines} lines, skipped ${skippedLines} invalid lines`);
        }
        
        return jobMap;
    } catch (error) {
        //If the file is not found or cannot be read, an error will be thrown.
        throw new Error(`Failed to read log file: ${error.message}`);
    }
}

module.exports = { parseLogFile, parseLogLine };