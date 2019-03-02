import { LLLClient } from "../../LLLClient";
import { Util } from "discord.js";

module.exports = (client : LLLClient) => {
    client.on("guildMemberAdd", async member => {
        const SM = client.exports.get("settings.manager");
        if (SM.getSetting("memberJoin", member.guild)) {
            const channel = SM.getLogChannelForGuild(member.guild);
            if (channel && (channel.permissionsFor(client.user)!).has(["SEND_MESSAGES", "EMBED_LINKS"])) {
                try {
                    await channel.send(
                        client.embeds.info(`**${Util.escapeMarkdown(member.user.tag)}** has joined the server.`)
                        .setTimestamp()
                        .setTitle(`Member Join | ${member.user.tag}`)
                        .setColor(0x00ff00)
                        .setAuthor(member.user.tag, member.user.avatarURL)
                    );
                } catch (_) {}
            }
        }
    });

    client.on("guildMemberRemove", async member => {
        const SM = client.exports.get("settings.manager");
        if (SM.getSetting("memberLeave", member.guild)) {
            const channel = SM.getLogChannelForGuild(member.guild);
            if (channel && (channel.permissionsFor(client.user)!).has(["SEND_MESSAGES", "EMBED_LINKS"])) {
                try {
                    await channel.send(
                        client.embeds.info(`**${Util.escapeMarkdown(member.user.tag)}** has left the server.`)
                        .setTimestamp()
                        .setTitle(`Member Left | ${member.user.tag}`)
                        .setColor(0xff0000)
                        .setAuthor(member.user.tag, member.user.avatarURL)
                    );
                } catch (_) {}
            }
        }
    });
};