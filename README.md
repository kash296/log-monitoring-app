# Log Monitoring Application

A Node.js application that parses CSV-format Log files and logs alerts when jobs exceed duration thresholds.

#  Prerequisites

A system with Node.js 14 or higher installed

## What it does

- Parses CSV log files with job START/END entries
- Calculates job durations 
- **Warnings**: Jobs > 5 minutes
- **Errors**: Jobs > 10 minutes
- **Incomplete**: Jobs missing END duration

## Installation

1. Clone the repository:
```bash
git clone https://github.com/kash296/log-monitoring-app.git
cd log-monitoring-app
```

2. Install dependencies:
```bash
npm install
```

## Quick Start
```bash
npm start                    # Process logs.log
```
```bash
npm start custom.log         # Process custom file
```
```bash
npm test                     # Run tests
```

## Features

- Parses CSV-formatted log files with job start/end timestamps
- Tracks job durations from start to finish
- Generates warnings for jobs lasting longer than 5 minutes
- Generates errors for jobs lasting longer than 10 minutes
- Handles malformed log entries gracefully
- Processes jobs across midnight boundary - 24 hours are added to calculations when jobs cross midnight
- Clear error reporting
- Unit tests covering CSV parsing, job duration calculation, incomplete jobs etc.

### Key Assumptions
- **Time Format**: All timestamps are in HH:MM:SS format within the same day
- **Midnight Crossing**: Jobs that cross midnight (end time < start time) are handled by adding 24 hours to the calculation
- **Duplicate Entries**: If duplicate START or END entries are found for the same PID, the application warns and uses the latest entry
- **Malformed Entries**: Invalid log lines are skipped with a warning, allowing processing to continue
- **Thresholds**: Warnings trigger for jobs **strictly greater than** 5 minutes, errors for jobs **strictly greater than** 10 minutes


## Log Format
The application expects CSV-formatted log entries with the following structure:

```bash
11:35:23,scheduled task 032,START,37980
11:35:56,scheduled task 032,END,37980
```
```bash
Format: timestamp,description,status,pid
```

## Sample Output
The application provides three types of alerts:

### Warnings
Jobs that take **more than 5 minutes** but **10 minutes or less** to complete.

### Errors  
Jobs that take **more than 10 minutes** to complete.

### Incomplete Jobs
Jobs that have either a START entry without a corresponding END entry, or vice versa.

The final output would look like this:

```bash
Processing the given log file: logs.log
Found 45 jobs in log file

--- WARNINGS ---
WARNING: Job 87228 (scheduled task 268) took 9.47 minutes

--- ERRORS ---
ERROR: Job 81258 (background job wmy) took 14.77 minutes

--- INCOMPLETE JOBS ---
INCOMPLETE: Job 72029 (scheduled task 333) - Missing END

==================================================
SUMMARY:
Total jobs: 45
Warnings (>5 min): 9
Errors (>10 min): 10
Incomplete jobs: 2
```