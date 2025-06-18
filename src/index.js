const { parseLogFile } = require("./parser")
const { checkJobDurations } = require("./jobDurationChecker")

function main() {
    const logFilePath = process.argv[2] || 'logs.log';
    
    try {
        console.log(`Processing the given log file: ${logFilePath}`);
        
        //Parse the given log file line by line
        const jobMap = parseLogFile(logFilePath);
        console.log(`Found ${jobMap.size} jobs in log file`);
        
        //Generate alerts based on the duration of jobs in the map
        const results = checkJobDurations(jobMap);
        

        console.log('\n' + '='.repeat(50));
        console.log('SUMMARY:');
        console.log(`Total jobs: ${jobMap.size}`);
        console.log(`Warnings (>5 min): ${results.warnings.length}`);
        console.log(`Errors (>10 min): ${results.errors.length}`);
        
    } catch (error) {
        console.error('Error processing log file:', error.message);
        process.exit(1);
    }
}

main();