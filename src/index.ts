import { Client, GatewayIntentBits, Message } from "discord.js";

import dotenv from "dotenv";
import fs from "fs";

import logger from "./utils/logger.ts";
import config from "./config.ts";
import commands from "./commands/index.ts";
import { readPrefix } from "./commands/prefix.ts";
import makeDeletable from "./utils/makeDeletable.ts";

dotenv.config();
fs.mkdirSync(config.outputDir, { recursive: true });

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

client.once("ready", () => {
    const tag = client.user?.tag;
    return tag
        ? logger.info(`Logged in as ${tag}!`)
        : logger.warn("Client user is null");
});

client.on("messageCreate", async (message: Message) => {
    if (message.author.bot) return;

    const userId = message.author.id;
    const prefix = readPrefix(userId);

    for (const command of commands) {
        if (!message.content.startsWith(prefix.prefix + command.name)) continue;

        try {
            const reply = await command.callback(client, message);
            await makeDeletable(client, message, reply);
        } catch (error) {
            logger.error(
                error instanceof Error ? error.message : String(error),
            );
        }

        break;
    }
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
