import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import logger from "./utils/logger.ts";
import config from "./config.ts";
import fs from "fs";

dotenv.config();

fs.mkdirSync(config.outputDir, { recursive: true });

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once("ready", () => {
    if (client.user) {
        logger.info(`Logged in as ${client.user.tag}!`);
        return;
    }
    logger.warn("Client user is null");
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    logger.info(`Message from ${message.author.username}: ${message.content}`);
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
