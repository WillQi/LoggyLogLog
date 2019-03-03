import { LLLClient } from "../../LLLClient";
import { GuildAuditLogs, Util } from "discord.js";

module.exports = (client : LLLClient) => {

    client.on("roleCreate", async role => {
        const SM = client.exports.get("settings.manager");
        if (SM.getSetting("guildActions", role.guild)) {
            const channel = SM.getLogChannelForGuild(role.guild);
            if (channel && (channel.permissionsFor(client.user)!).has(["SEND_MESSAGES", "EMBED_LINKS"])) {
                const member = await role.guild.fetchMember(client.user);
                if (member.hasPermission("VIEW_AUDIT_LOG")) {
                    const log = ((await role.guild.fetchAuditLogs({
                        type: GuildAuditLogs.Actions.ROLE_CREATE,
                        limit: 1
                    })).entries).first();
                    
                    try {
                        await channel.send(
                            client.embeds.custom("A role was created.", 0xff8800)
                            .setTitle("Role Created")
                            .setAuthor(log.executor.tag, log.executor.avatarURL)
                            .setTimestamp()
                        );
                    } catch (_) {}
                } else {
                    try {
                        await channel.send(
                            client.embeds.custom("A role was created.", 0xff8800)
                            .setTitle("Role Created")
                            .setTimestamp()
                        );
                    } catch (_) {}
                }
            }
        }
    });

    client.on("roleDelete", async role => {
        const SM = client.exports.get("settings.manager");
        if (SM.getSetting("guildActions", role.guild)) {
            const channel = SM.getLogChannelForGuild(role.guild);
            if (channel && (channel.permissionsFor(client.user)!).has(["SEND_MESSAGES", "EMBED_LINKS"])) {
                const member = await role.guild.fetchMember(client.user);
                if (member.hasPermission("VIEW_AUDIT_LOG")) {
                    const log = ((await role.guild.fetchAuditLogs({
                        type: GuildAuditLogs.Actions.ROLE_DELETE,
                        limit: 1
                    })).entries).first();
                    
                    try {
                        await channel.send(
                            client.embeds.custom(`**${Util.escapeMarkdown(role.name)}** was deleted.`, 0xff0000)
                            .setTitle("Role Deleted")
                            .setAuthor(log.executor.tag, log.executor.avatarURL)
                            .setTimestamp()
                        );
                    } catch (_) {}
                } else {
                    try {
                        await channel.send(
                            client.embeds.custom(`**${Util.escapeMarkdown(role.name)}** was deleted.`, 0xff0000)
                            .setTitle("Role Deleted")
                            .setTimestamp()
                        );
                    } catch (_) {}
                }
            }
        }
    });

    client.on("roleUpdate", async (oldRole, newRole) => {
        const SM = client.exports.get("settings.manager");
        if (SM.getSetting("guildActions", newRole.guild)) {
            const channel = SM.getLogChannelForGuild(newRole.guild);
            if (channel && (channel.permissionsFor(client.user)!).has(["SEND_MESSAGES", "EMBED_LINKS"])) {
                const member = await newRole.guild.fetchMember(client.user);
                if (newRole.name !== oldRole.name || newRole.permissions !== oldRole.permissions || newRole.hoist !== oldRole.hoist || newRole.color !== oldRole.color || newRole.mentionable !== oldRole.mentionable) {

                    let embed = client.embeds.custom(``, 0x0000aa)
                        .setTimestamp();

                    if (member.hasPermission("VIEW_AUDIT_LOG")) {
                            const log = ((await newRole.guild.fetchAuditLogs({
                                type: GuildAuditLogs.Actions.ROLE_UPDATE,
                                limit: 1
                            })).entries).first();
                            embed.setAuthor(log.executor.tag, log.executor.avatarURL);
                    }

                    if (newRole.name !== oldRole.name) {
                        embed = embed.setDescription(`**Before**: ${Util.escapeMarkdown(oldRole.name)}\n\n**After**: ${Util.escapeMarkdown(newRole.name)}`)
                            .setTitle("Role Updated | Name");
                    } else if (newRole.permissions !== oldRole.permissions) {
                        // TODO: Vote locked, what permissions were changed?
                        embed = embed.setTitle("Role Updated | Permissions")
                            .setDescription(`**${Util.escapeMarkdown(newRole.name)}**'s permissions have been changed.`);
                    } else if (newRole.hoist !== oldRole.hoist) {
                        embed = embed.setDescription(newRole.hoist ? `**${Util.escapeMarkdown(newRole.name)}** is now hoisted.` : `**${Util.escapeMarkdown(newRole.name)}** is no longer hoisted.`)
                            .setTitle("Role Updated | Hoist");
                    } else if (newRole.color !== oldRole.color) {
                        //TODO: Vote locked, what color.
                        embed = embed.setTitle("Role Updated | Color")
                            .setDescription(`**${Util.escapeMarkdown(newRole.name)}**'s color has changed.`);
                    } else if (newRole.mentionable !== oldRole.mentionable) {
                        embed = embed.setTitle("Roled Updated | Mentionable")
                            .setDescription(newRole.mentionable ? `**${Util.escapeMarkdown(newRole.name)}** is now mentionable.` : `**${Util.escapeMarkdown(newRole.name)}** is no longer mentionable.`);
                    }

                    try {
                        await channel.send(embed);
                    } catch (_) {}

                }
            }
        }
    });

};