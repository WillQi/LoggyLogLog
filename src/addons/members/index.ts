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
                        .setTitle("Member Joined")
                        .setColor(0x00ff00)
                        .setAuthor(member.user.tag, member.user.avatarURL || member.user.defaultAvatarURL)
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
                        .setTitle("Member Left")
                        .setColor(0xff0000)
                        .setAuthor(member.user.tag, member.user.avatarURL || member.user.defaultAvatarURL)
                    );
                } catch (_) {}
            }
        }
    });

    // client.on("guildMemberUpdate", async (oldMember, newMember) => {
    //     const SM = client.exports.get("settings.manager");
    //     if (SM.getSetting("guildActions", newMember.guild)) {
    //         const channel = SM.getLogChannelForGuild(newMember.guild);
    //         if (channel && (channel.permissionsFor(client.user)!).has(["SEND_MESSAGES", "EMBED_LINKS"])) {
    //             // Ok. What changed?
    //             if (oldMember.nickname !== newMember.nickname) {
    //                 try {
    //                     await channel.send(
    //                         client.embeds.info(`**${Util.escapeMarkdown(newMember.user.tag)}** has left the server.`)
    //                         .setTimestamp()
    //                         .setTitle("Member Update | Nickname")
    //                         .setColor(0xaaaaff)
    //                         .setAuthor(member.user.tag, member.user.avatarURL || member.user.defaultAvatarURL)
    //                     );
    //                 } catch (_) {}
    //             } else if (oldMember.roles.size !== newMember.roles.size) {

    //             }
    //         }
    //     }
    // });
};