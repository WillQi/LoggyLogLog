import { LLLClient } from "../../LLLClient";
import { CommandCategories } from "../../utils/LLLClient";
import { SettingsManager } from "./SettingsManager";
import { TextChannel } from "discord.js";


module.exports = (client : LLLClient) => {

    const SM = new SettingsManager(client);
    client.exports.set("settings.manager", SM);

    client.addCommand("settings", {
        category: CommandCategories.CONFIGURATION_COMMANDS,
        description: "Set what should be logged in your guild."
    }, async message => {
        const getSelection = client.exports.get("utils.getSelection");
        const choice = await getSelection(message.author, message.channel as TextChannel, client.embeds.info(""), [
            {
                display: SM.getSetting("messageDelete", message.guild) ? "Stop logging deleted messages" : "Start logging deleted messages",
                id: "messageDelete"
            },
            {
                display: SM.getSetting("messageEdit", message.guild) ? "Stop logging message edits" : "Start logging message edits",
                id: "messageEdit"
            },
            {
                display: SM.getSetting("guildActions", message.guild) ? "Stop logging guild modifications" : "Start logging guild modifications",
                id: "guildActions"
            },
            {
                display: SM.getSetting("memberJoin", message.guild) ? "Stop logging member joins" : "Start logging member joins",
                id: "memberJoin"
            },
            {
                display: SM.getSetting("memberLeave", message.guild) ? "Stop logging member leaves" : "Start logging member leaves",
                id: "memberLeave"
            }
        ]);
        if (choice) {
            SM.setSetting(choice, !SM.getSetting(choice, message.guild), message.guild);
            await message.channel.send(
                client.embeds.success(`I will now ${!SM.getSetting(choice, message.guild) ? "stop" : "start"} logging ${choice === "messageDelete" ? "deleted messages" : choice === "messageEdit" ? "message edits" : choice === "guildActions" ? "guild modifications" : choice === "memberJoin" ? "member joins" : "member leaves"}.`)
            );
        }
    });

    client.addCommand("log-channel", {
        category: CommandCategories.CONFIGURATION_COMMANDS,
        description: "Declare the channel where log messages will be sent."
    }, async message => {
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            await message.channel.send(
                client.embeds.error("You require `MANAGE_GUILD` to use this command.")
            );
            return;
        }
        const channel = message.mentions.channels.first() || message.channel;
        SM.setLogChannelForGuild(channel, message.guild);
        await message.channel.send(
            client.embeds.success(`Log messages will now be sent to ${channel}.`)
        );
    });
};