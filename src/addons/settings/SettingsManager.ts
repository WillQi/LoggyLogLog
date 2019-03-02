import { LLLClient } from "../../LLLClient";
import { LLLStorage } from "../../LLLStorage";
import { GuildResolvable, ChannelResolvable, UserResolvable, TextChannel } from "discord.js";
import { StorageKeys } from "../../utils/Storage";

const STORAGE_KEY = "logSettings";

interface LogSettings {
    messageDelete: boolean,
    messageEdit: boolean,
    guildActions: boolean,
    memberLeave: boolean,
    memberJoin: boolean,
}

class SettingsManager {

    private storage : LLLStorage;

    private client : LLLClient;

    private settings : StorageKeys["logSettings"];

    constructor (client : LLLClient) {
        this.storage = client.storage;
        this.client = client;
        this.settings = client.storage.get(STORAGE_KEY, {});
    }

    getLogChannelForGuild (guild : GuildResolvable) {
        this.ensureSettings(guild);
        const id = this.resolve(guild);
        return this.client.channels.get(this.settings[id].channel || "") as TextChannel;
    }

    getSetting<LogSetting extends keyof LogSettings> (setting : LogSetting, guild : GuildResolvable) : LogSettings[LogSetting] {
        const id = this.resolve(guild);
        this.ensureSettings(id);
        return this.settings[id][setting];
    }

    ignoreChannelForGuild (channel : ChannelResolvable, guild : GuildResolvable) {
        const cId = this.resolve(channel);
        const gId = this.resolve(guild);
        this.ensureSettings(gId);
        const index = this.settings[gId].ignoreChannels.indexOf(cId);
        if (index === -1) {
            this.settings[gId].ignoreChannels.push(cId);
            this.save();
            return true;
        }
        return false;
    }

    ignoreUserForGuild (user : UserResolvable, guild : GuildResolvable) {
        const uId = this.resolve(user);
        const gId = this.resolve(guild);
        this.ensureSettings(gId);
        const index = this.settings[gId].ignoreUsers.indexOf(uId);
        if (index === -1) {
            this.settings[gId].ignoreUsers.push(uId);
            this.save();
            return true;
        }
        return false;
    }

    isChannelIgnoredForGuild (channel : ChannelResolvable, guild : GuildResolvable) {
        const cId = this.resolve(channel);
        const gId = this.resolve(guild);
        this.ensureSettings(gId);
        return this.settings[gId].ignoreChannels.includes(cId);
    }

    isUserIgnoredForGuild (user : UserResolvable, guild : GuildResolvable) {
        const uId = this.resolve(user);
        const gId = this.resolve(guild);
        this.ensureSettings(gId);
        return this.settings[gId].ignoreUsers.includes(uId);
    }

    setLogChannelForGuild (channel: ChannelResolvable, guild : GuildResolvable) {
        this.ensureSettings(guild);
        const gId = this.resolve(guild);
        const cId = this.resolve(channel);
        this.settings[gId].channel = cId;
        this.save();
    }

    setSetting<LogSetting extends keyof LogSettings> (setting : LogSetting, value : LogSettings[LogSetting], guild : GuildResolvable) {
        const id = this.resolve(guild);
        this.ensureSettings(id);
        this.settings[id][setting] = value;
        this.save();
    }

    unignoreChannelForGuild (channel : ChannelResolvable, guild : GuildResolvable) {
        const cId = this.resolve(channel);
        const gId = this.resolve(guild);
        this.ensureSettings(gId);
        const index = this.settings[gId].ignoreChannels.indexOf(cId);
        if (index !== -1) {
            this.settings[gId].ignoreChannels.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }

    unignoreUserForGuild (user : UserResolvable, guild : GuildResolvable) {
        const uId = this.resolve(user);
        const gId = this.resolve(guild);
        this.ensureSettings(gId);
        const index = this.settings[gId].ignoreUsers.indexOf(uId);
        if (index !== -1) {
            this.settings[gId].ignoreUsers.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }

    private ensureSettings (guild : GuildResolvable) {
        const id = this.resolve(guild);
        this.settings[id] = this.settings[id] || {
            messageDelete: true,
            messageEdit: true,
            guildActions: true,
            memberLeave: true,
            memberJoin: true,
            ignoreChannels: [],
            ignoreUsers: []
        };
    }

    private resolve (resolvable : GuildResolvable|ChannelResolvable|UserResolvable) {
        return typeof resolvable === "string" ? resolvable : resolvable.id;
    }

    private save () {
        this.storage.set(STORAGE_KEY, this.settings);
    }

}

export {
    SettingsManager
};