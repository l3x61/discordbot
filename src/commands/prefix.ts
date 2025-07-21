import { Client, Message } from "discord.js";
import db from "../db.ts";

type Prefix = {
    userId: string;
    prefix: string;
};

export function readAllPrefixes(): Prefix[] {
    const stmt = db.prepare("SELECT * FROM prefixes");
    return stmt.all() as Prefix[];
}

export function readPrefix(userId: string): Prefix {
    const stmt = db.prepare("SELECT prefix FROM prefixes WHERE userId = ?");
    const prefix = stmt.get(userId) as Prefix;
    return prefix || { userId, prefix: "" };
}

export function createPrefix(userId: string, prefix: string) {
    const stmt = db.prepare(
        "INSERT OR REPLACE INTO prefixes (userId, prefix) VALUES (?, ?)",
    );
    stmt.run(userId, prefix);
}

export function deletePrefix(userId: string) {
    const stmt = db.prepare("DELETE FROM prefixes WHERE userId = ?");
    stmt.run(userId);
}

export default async function (client: Client, message: Message) {
    const userId = message.author.id;
    const [, ...args] = message.content.split(" ");

    // prefix all
    if (args[0] === "list") {
        const prefixes = readAllPrefixes();
        const lines = prefixes.map((p) => {
            return `<@${userId}>: \`${p.prefix}\``;
        });
        return message.reply(
            "### User: Prefix\n" +
                (lines.length != 0 ? lines.join("\n") : "No one set a prefix."),
        );
    }

    // prefix set [prefix]
    if (args[0] === "set") {
        if (!args[1]) {
            deletePrefix(userId);
            return message.reply("Prefix deleted");
        }
        createPrefix(message.author.id, args[1]);
        return message.reply(`Prefix set to \`${args[1]}\``);
    }

    // prefix [help]
    const msg =
        "### Prefix Usage\n" +
        "`prefix [help]` - print this message\n" +
        "`prefix list` - list prefix of each user\n" +
        "`prefix set [prefix]` - set prefix\n";
    return message.reply(msg);
}
