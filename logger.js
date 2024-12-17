import fs from "node:fs";

export function createLogger(filename) {
  return {
    log: (message) => {
      const timestamp = new Date().toISOString();
      const logMessage = `${timestamp} - ${message}\n`;
      console.log(message);
      fs.appendFileSync(filename, logMessage);
    },
    error: (message, error) => {
      const timestamp = new Date().toISOString();
      const logMessage = `${timestamp} - ERROR: ${message} - ${error.message}\n`;
      console.error(message, error);
      fs.appendFileSync(filename, logMessage);
    },
  };
}
