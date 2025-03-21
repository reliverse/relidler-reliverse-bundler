import { defineConfig } from "./src/libs/sdk/sdk-impl/utils/utils-logs.js";

/**
 * Relinka Logger Configuration
 *
 * This configuration can also be set using environment variables:
 * - RELINKA_TIMESTAMP: Whether to include timestamps in logs (true/false)
 * - RELINKA_SAVE_LOGS: Whether to save logs to a file (true/false)
 * - RELINKA_LOG_FILE: Path to the log file
 * - RELINKA_DEBUG: Whether to enable verbose logging (true/false)
 * - RELINKA_LOG_DIR: Directory to store log files
 * - RELINKA_DAILY_LOGS: Whether to create separate log files for each day (true/false)
 * - RELINKA_MAX_LOG_FILES: Maximum number of log files to keep (0 = unlimited)
 * - RELINKA_USE_PARENT_CONFIG: Whether to look for config in parent directory when in dist folders (true/false)
 *
 * @see https://github.com/reliverse/relinka
 */
export default defineConfig({
  // Whether to enable verbose logging
  debug: true,

  // Directory-specific configuration
  dirs: {
    // Whether to create separate log files for each day
    dailyLogs: false,

    // Log directory path
    logDir: ".",

    // Maximum number of log files to keep (0 = unlimited)
    maxLogFiles: 10,

    // Special directory handling
    specialDirs: {
      // List of directory names considered as dist folders
      distDirNames: ["dist-jsr", "dist-npm", "dist-libs", "dist"],

      // Whether to look for config in parent directory when in dist folders
      useParentConfigInDist: true,
    },
  },

  // Whether to disable colors in console output
  disableColors: false,

  // Path to the log file (relative to cwd)
  logFilePath: "relinka.log",

  // Whether to save logs to a file
  saveLogsToFile: true,

  // Whether to include timestamps in logs
  withTimestamp: false,
});
