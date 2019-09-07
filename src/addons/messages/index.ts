import { LLLClient } from "../../LLLClient";
import { Util } from "discord.js";

module.exports = (client : LLLClient) => {

    client.on("messageDelete", async message => {
        if (message.channel.type === "text" && !message.author.bot && !message.content.split(" ")[0].match(/play/i)) {
            const SM = client.exports.get("settings.manager");
            if (SM.getSetting("messageDelete", message.guild)) {
                const channel = SM.getLogChannelForGuild(message.guild);
                if (channel && (channel.permissionsFor(client.user)!).has(["SEND_MESSAGES", "EMBED_LINKS"])) {
                    try {
                        await channel.send(
                            client.embeds.info(`A message by **${Util.escapeMarkdown(message.author.tag)}** was deleted in ${message.channel}.\n**Content**: \`${Util.escapeMarkdown(message.content)}\``)
                                .setTitle("Message Deleted")
                                .setAuthor(message.author.tag, message.author.avatarURL || message.author.defaultAvatarURL)
                                .setTimestamp()
                        );
                    } catch (_) {}
                }
            }
        }    
    });

    client.on("messageDeleteBulk", async messages => {
        const SM = client.exports.get("settings.manager");
        const guild = messages.first().guild;
        const channel = SM.getLogChannelForGuild(guild);
        if (SM.getSetting("messageDelete", guild)) {
            if (channel && (channel.permissionsFor(client.user)!).has(["SEND_MESSAGES", "EMBED_LINKS"])) {
                try {
                    await channel.send(
                        client.embeds.info(`${messages.size} messages were deleted in ${messages.first().channel}.`)
                        .setTitle("Message Purge")
                        .setColor(0xff0000)
                        .setTimestamp()
                    );
                } catch (_) {}
            }
        }
    });

    client.on("messageUpdate", async (oldMessage, newMessage) => {
        const SM = client.exports.get("settings.manager");
        if (newMessage.channel.type === "text" && oldMessage.content !== newMessage.content && !newMessage.author.bot) {
            const guild = newMessage.guild;
            if (SM.getSetting("messageEdit", guild)) {
                const channel = SM.getLogChannelForGuild(guild);
                if (channel && (channel.permissionsFor(client.user)!).has(["SEND_MESSAGES", "EMBED_LINKS"])) {
                    try {
                        await channel.send(
                            client.embeds.info(`A message was edited in ${oldMessage.channel}\n**Before**: \`${Util.escapeMarkdown(oldMessage.content)}\`\n\n**After**: \`${Util.escapeMarkdown(newMessage.content)}\``)
                            .setTitle(`Message Edited`)
                            .setAuthor(newMessage.author.tag, newMessage.author.avatarURL || newMessage.author.defaultAvatarURL)
                            .setTimestamp()
                        );
                    } catch (_) {console.log(_)}
                }
            }

        }
    });
};