import ping from "./ping.ts";
import prefix from "./prefix.ts";

export default [
    {
        name: "ping",
        description: "Ping the bot",
        callback: ping,
    },
    {
        name: "prefix",
        description: "Change the command prefix",
        callback: prefix,
    },
];
