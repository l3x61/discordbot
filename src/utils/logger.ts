import path from "path";
import fs from "fs";
import ansi from "./ansi.ts";
import config from "../config.ts";

class Logger {
    private static instance: Logger;

    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private constructor() {}

    #internal(color: string, ...args: string[]) {
        const timestamp = new Date().toISOString();
        console.log(color + timestamp, ansi.reset, ...args, ansi.reset);

        const logPath = path.join(config.outputDir, config.logFile);
        fs.appendFile(logPath, `${timestamp}  ${args.join(" ")}\n`, (error) =>
            error ? console.error(`Error writing to ${logPath}`, error) : null,
        );
    }

    debug(...args: string[]) {
        this.#internal(ansi.dim, ...args);
    }

    info(...args: string[]) {
        this.#internal(ansi.cyan, ...args);
    }

    warn(...args: string[]) {
        this.#internal(ansi.yellow, ...args);
    }

    error(...args: string[]) {
        this.#internal(ansi.red, ...args);
    }
}

export default Logger.getInstance();
