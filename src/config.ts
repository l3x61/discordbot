import dotenv from "dotenv";
dotenv.config();

export default {
    outputDir: "output",
    logFile: "bot.log",
    dbFile: "bot.sqlite",
    defaultPrefix: "",
    timeoutMs: 2 * 60 * 1000,
    adminIds: process.env.ADMIN_IDS?.split(",").filter(Boolean) ?? [],
};
