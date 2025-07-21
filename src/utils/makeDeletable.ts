import { Client, Message, User } from "discord.js";
import type {
    MessageReaction,
    PartialMessage,
    PartialMessageReaction,
    PartialUser,
} from "discord.js";
import type { OmitPartialGroupDMChannel } from "discord.js";
import logger from "./logger.ts";
import config from "../config.ts";

export default async function (
    client: Client,
    originalMessage: Message,
    replyMessage: Message,
) {
    async function onDelete(
        deleted: OmitPartialGroupDMChannel<Message | PartialMessage>,
    ) {
        if (deleted.id !== originalMessage.id) return;

        replyMessage.delete().catch((error) => {
            logger.warn(
                "Failed to delete reply:",
                error instanceof Error ? error.message : String(error),
            );
        });

        cleanup();
    }

    async function onReaction(
        reaction: MessageReaction | PartialMessageReaction,
        user: User | PartialUser,
    ) {
        if (
            reaction.message.id !== replyMessage.id ||
            reaction.emoji.name !== "❌" ||
            !config.adminIds.includes(user.id)
        )
            return;

        replyMessage.delete().catch((error) => {
            logger.warn(
                "Failed to delete reply via reaction:",
                error instanceof Error ? error.message : String(error),
            );
        });

        cleanup();
    }

    function cleanup() {
        client.removeListener("messageDelete", onDelete);
        client.removeListener("messageReactionAdd", onReaction);
    }

    client.on("messageDelete", onDelete);
    client.on("messageReactionAdd", onReaction);

    try {
        await replyMessage.react("❌");
    } catch (error) {
        logger.warn(
            "Failed to add ❌ reaction:",
            error instanceof Error ? error.message : String(error),
        );
    }

    setTimeout(cleanup, config.timeoutMs);
}
