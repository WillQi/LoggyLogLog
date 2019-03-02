import { LLLClient } from "../../LLLClient";
import { Util } from "discord.js";

module.exports = (client : LLLClient) => {

    client.on("messageDelete", async message => {
        if (message.channel.type === "text" && !message.author.bot) {
            const SM = client.exports.get("settings.manager");
            if (SM.getSetting("messageDelete", message.guild)) {
                const channel = SM.getLogChannelForGuild(message.guild);
                if (channel && (channel.permissionsFor(client.user)!).has(["SEND_MESSAGES", "EMBED_LINKS"])) {
                    try {
                        await channel.send(
                            client.embeds.info(`Content: \`${Util.escapeMarkdown(message.content)}\`\n\nChannel: ${message.channel}\n\nUser: ${message.author}`)
                                .setTitle(`Message Deleted | ${message.author.tag}`)
                                .setTimestamp()
                        );
                    } catch (_) {}
                }
            }
        }    
    });

    client.on("messageDeleteBulk", async messages => {
        const SM = client.exports.get('settings.manager');
        const guild = messages.first().guild;
        const channel = SM.getLogChannelForGuild(guild);
        if (SM.getSetting("messageDelete", guild)) {
            if (channel && (channel.permissionsFor(client.user)!).has(["SEND_MESSAGES", "EMBED_LINKS"])) {
                try {
                    await channel.send(
                        client.embeds.info(`${messages.size} messages were deleted in ${messages.first().channel}.`)
                        .setTitle("Purge")
                        .setColor(0xff0000)
                    );
                } catch (_) {}
            }
        }
    });
};