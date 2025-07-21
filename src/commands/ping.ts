import { Client, Message } from "discord.js";

export default async function (client: Client, message: Message) {
    const latency = Date.now() - message.createdTimestamp;
    return await message.reply(`Pong! ${latency}ms`);
}
