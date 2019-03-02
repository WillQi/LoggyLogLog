import { ClientOptions, Channel, Guild, User, GuildMember, Collection, Snowflake, Message, MessageReaction, Role, ClientUserGuildSettings, ClientUserSettings, Emoji } from "discord.js";

export enum CommandCategories {
    GENERAL_COMMANDS = "General Commands",
    CONFIGURATION_COMMANDS = "Configuration Commands"
};

export interface DefaultSettings {
    /** Default prefix of a guild */
    prefix: string
};

export interface Command {
    name: string,
    options: CommandOptions,
    callback: (message: Message, args: string[]) => void|Promise<void>
};

export interface CommandOptions {
    botowner?: boolean,
    category?: string|CommandCategories
    description?: string,
    hide?: boolean,
    alias?: string[]
};

export interface LLLClientOptions extends ClientOptions {
    /** Database directory. */
    databaseDirectory: string,
    /** Addon directory. */
    addonDirectory: string,
    /** Bot owners */
    botowners: string[],
    /** Default settings for every guild. */
    defaultSettings: DefaultSettings,
    /** Cooldown delay. */
    cooldown: number
};

export interface DiscordEvents {
    channelCreate: [Channel],
    channelDelete: [Channel],
    channelPinsUpdate: [Channel, Date],
    channelUpdate: [Channel, Channel],
    clientUserGuildSettingsUpdate: [ClientUserGuildSettings],
    clientUserSettingsUpdate: [ClientUserSettings],
    debug: [string],
    disconnect: [CloseEvent],
    emojiCreate: [Emoji],
    emojiDelete: [Emoji],
    emojiUpdate: [Emoji, Emoji],
    error: [Error],
    guildBanAdd: [Guild, User],
    guildBanRemove: [Guild, User],
    guildCreate: [Guild],
    guildDelete: [Guild],
    guildMemberAdd: [GuildMember],
    guildMemberAvailable: [GuildMember],
    guildMemberRemove: [GuildMember],
    guildMembersChunk: [Array<GuildMember>, Guild],
    guildMemberSpeaking: [GuildMember, boolean],
    guildMemberUpdate: [GuildMember, GuildMember],
    guildUnavailable: [Guild],
    guildUpdate: [Guild, Guild],
    message: [Message],
    messageDelete: [Message],
    messageDeleteBulk: [Collection<Snowflake, Message>],
    messageReactionAdd: [MessageReaction, User],
    messageReactionRemove: [MessageReaction, User],
    messageReactionRemoveAll: [Message],
    messageUpdate: [Message, Message],
    presenceUpdate: [GuildMember, GuildMember],
    rateLimit: [{
        timeout: number,
        limit: number,
        method: string,
        path: string,
        route: string
    }],
    ready: [],
    reconnecting: [],
    resume: [number],
    roleCreate: [Role],
    roleDelete: [Role],
    roleUpdate: [Role, Role],
    typingStart: [Channel, User],
    typingStop: [Channel, User],
    userNoteUpdate: [User, string, string],
    userUpdate: [User, User],
    voiceStateUpdate: [GuildMember, GuildMember],
    warn: [string]
};
