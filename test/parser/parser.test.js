const { parseLogLine, parseLogFile } = require("../../src/parser");
const path = require("path");

describe("Log Parser", () => {
  test("should parse a single log line correctly", () => {
    const line = "11:35:23,scheduled task 032, START,37980";
    const result = parseLogLine(line);

    expect(result).toEqual({
      timestamp: "11:35:23",
      description: "scheduled task 032",
      status: "START",
      pid: "37980",
    });
  });

  test("should throw error for invalid line format", () => {
    const invalidLine = "11:35:23,invalid";
    expect(() => parseLogLine(invalidLine)).toThrow("Invalid log line format");
  });

  test("should parse the actual log file into a Map", () => {
    const logPath = path.join(process.cwd(), "logs.log");
    const jobMap = parseLogFile(logPath);
    expect(jobMap).toBeInstanceOf(Map);
    expect(jobMap.size).toBeGreaterThan(0);

    const firstJob = jobMap.values().next().value;
    expect(firstJob).toHaveProperty("pid");
    expect(firstJob).toHaveProperty("description");
    // Should have at least one of startTime or endTime
    expect(firstJob.startTime || firstJob.endTime).toBeDefined();
  });

  test("should create job objects with start and end times", () => {
    const logPath = path.join(process.cwd(), "logs.log");
    const jobMap = parseLogFile(logPath);

    const job = jobMap.get("37980");
    expect(job).toBeDefined();
    expect(job.startTime).toBe("11:35:23");
    expect(job.endTime).toBe("11:35:56");
    expect(job.description).toBe("scheduled task 032");
  });
});
