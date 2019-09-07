import { LLLClient } from "../../LLLClient";
import { GuildAuditLogs, GuildChannel, TextChannel, VoiceChannel } from "discord.js";

module.exports = (client : LLLClient) => {



    client.on("channelCreate", async channel => {
        if (["category", "text", "voice"].includes(channel.type)) {
            const SM = client.exports.get("settings.manager");
            const guild = (channel as GuildChannel).guild;
            if (SM.getSetting("guildActions", guild)) {
                const logChannel = SM.getLogChannelForGuild(guild);
                if (logChannel && (logChannel.permissionsFor(client.user)!).has(["SEND_MESSAGES", "EMBED_LINKS"])) {
                    const member = await guild.fetchMember(client.user);

                    if (member.hasPermission("VIEW_AUDIT_LOG")) {

                        const log = ((await guild.fetchAuditLogs({
                            type: GuildAuditLogs.Actions.CHANNEL_CREATE,
                            limit: 1
                        })).entries).first();

                        try {
                            await logChannel.send(
                                client.embeds.custom(`The channel ${(channel as GuildChannel).name} was created.`, 0x00aa00)
                                    .setTitle("Channel Created")
                                    .setAuthor(log.executor.tag, log.executor.avatarURL || log.executor.defaultAvatarURL)
                                    .setTimestamp()
                            );
                        } catch (_) {}
                    } else {
                        try {
                            await logChannel.send(
                                client.embeds.custom(`The channel ${(channel as GuildChannel).name} was created.`, 0x00aa00)
                                    .setTitle("Channel Created")
                                    .setTimestamp()
                            );
                        } catch (_) {}
                    }
                }
            }
        }
    });




    client.on("channelDelete", async channel => {
        if (["category", "text", "voice"].includes(channel.type)) {
            const SM = client.exports.get("settings.manager");
            const guild = (channel as GuildChannel).guild;
            if (SM.getSetting("guildActions", guild)) {
                const logChannel = SM.getLogChannelForGuild(guild);
                if (logChannel && (logChannel.permissionsFor(client.user)!).has(["SEND_MESSAGES", "EMBED_LINKS"])) {
                    const member = await guild.fetchMember(client.user);

                    if (member.hasPermission("VIEW_AUDIT_LOG")) {

                        const log = ((await guild.fetchAuditLogs({
                            type: GuildAuditLogs.Actions.CHANNEL_DELETE,
                            limit: 1
                        })).entries).first();

                        try {
                            await logChannel.send(
                                client.embeds.custom(`The channel ${(channel as GuildChannel).name} was deleted.`, 0xff0000)
                                    .setTitle("Channel Deleted")
                                    .setAuthor(log.executor.tag, log.executor.avatarURL || log.executor.defaultAvatarURL)
                                    .setTimestamp()
                            );
                        } catch (_) {}
                    } else {
                        try {
                            await logChannel.send(
                                client.embeds.custom(`The channel #${(channel as GuildChannel).name} was deleted.`, 0xff0000)
                                    .setTitle("Channel Deleted")
                                    .setTimestamp()
                            );
                        } catch (_) {}
                    }
                }
            }
        }
    });



    client.on("channelUpdate", async (oldChannel, newChannel) => {
        if (["category", "text", "voice"].includes(newChannel.type)) {
            const SM = client.exports.get("settings.manager");
            const guild = (newChannel as GuildChannel).guild;
            if (SM.getSetting("guildActions", guild)) {

                let embed = client.embeds.custom("", 0x777700)
                    .setTimestamp()
                    .setTitle("Channel Update");

                let desc = `${newChannel} was updated.`;

                const member = await guild.fetchMember(client.user);
                if (member.hasPermission("VIEW_AUDIT_LOG")) {
                    const log = ((await guild.fetchAuditLogs({
                        type: GuildAuditLogs.Actions.CHANNEL_UPDATE,
                        limit: 1
                    })).entries).first();
                    embed = embed.setAuthor(log.executor.tag, log.executor.avatarURL || log.executor.defaultAvatarURL);
                }

                if ((oldChannel as GuildChannel).name !== (newChannel as GuildChannel).name) {
    
                }
                if (newChannel.type === "text" && (oldChannel as TextChannel).topic !== (newChannel as TextChannel).topic) {

                }
                if ((oldChannel as GuildChannel).parentID !== (newChannel as GuildChannel).parentID) {

                } 
                if (newChannel.type === "text" && (newChannel as TextChannel).nsfw !== (oldChannel as TextChannel).nsfw) {
                    
                }
                if (newChannel.type === "voice" && (newChannel as VoiceChannel).bitrate !== (oldChannel as VoiceChannel).bitrate) {

                }
                if (newChannel.type === "voice" && (newChannel as VoiceChannel).userLimit !== (oldChannel as VoiceChannel).userLimit) {

                }
                if (!(newChannel as GuildChannel).permissionOverwrites.equals((oldChannel as GuildChannel).permissionOverwrites)) {

                }

                embed = embed.setDescription(desc);
                try {
                    
                } catch (_) {}
            }
        }
    });





};