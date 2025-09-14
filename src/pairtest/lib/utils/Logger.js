import * as winston from "winston";
import dotenv from "dotenv";
dotenv.config();

const logConfig = {
  "level": process.env.LOG_LEVEL || "info",
  "transports": [
    new winston.transports.Console()
  ]
}
const logger = winston.createLogger(logConfig);

export default logger