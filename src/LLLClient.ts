import Enmap from "enmap";
import { Client, Message, TextChannel, ClientUser, DiscordAPIError } from "discord.js";
import { join } from "path";
import { LLLClientOptions, DiscordEvents, Command, CommandOptions, DefaultSettings } from "./utils/LLLClient";
import { LLLStorage } from "./LLLStorage";
import { LLLExports } from "./LLLExports";
import { LLLEmbeds } from "./utils/LLLEmbeds";
import { readdirSync } from "fs";

export class LLLClient extends Client {

    storage: LLLStorage;

    exports: LLLExports;

    commands: Command[];

    embeds: typeof LLLEmbeds;

    private eventListeners: Enmap;

    private cooldowns: Enmap;

    private addonDirectory: string;

    private cooldownDelay: number;

    private defaultSettings: DefaultSettings;

    private addons: ((client: LLLClient) => void)[]

    private botowners: string[];

    constructor (options: LLLClientOptions) {
        super(options);

        this.addonDirectory = options.addonDirectory;
        this.defaultSettings = options.defaultSettings;
        this.cooldownDelay = options.cooldown;
        this.botowners = options.botowners;

        this.storage = new LLLStorage(options.databaseDirectory);
        this.exports = new LLLExports();
        this.embeds = LLLEmbeds;

        this.commands = [];

        this.addons = this.getAddons();

        this.eventListeners = new Enmap();
        this.cooldowns = new Enmap();

        this.createCommandHandler();
        this.createGuildConfigurationHandlers();

    }

    /**
     * @param name Name of the command.
     * @param options Options of the command.
     * @param callback Callback to call once the command is run.
     */
    addCommand (name : string, options : CommandOptions, callback : (message: Message, args: string[]) => void) {
        if (options.alias) options.alias = options.alias.map(alias => alias.toLocaleLowerCase());
        this.commands.push({
            options,
            callback,
            name: name.toLocaleLowerCase()
        });
    }

    on<DEvent extends keyof DiscordEvents> (event: DEvent, listener: (...args: DiscordEvents[DEvent]) => void) : this {

        //super(options) calls this, so we just do what would normally happen.
        if (!this.eventListeners) {
            // @ts-ignore
            this.addListener.apply(this, arguments);
            return this;
        }
        //Ok, now we just append it to our _listeners so we don't create unnecessary listeners.
        if (!this.eventListeners.has(event)) {
            this.addListener(event, (...args) => {
                const cbs = this.eventListeners.get(event);
                for (const cb of cbs) {
                    try {
                        const response = cb.apply(this, args);
                        if (response instanceof Promise) {
                            response.catch(error => {
                                console.error("=====");
                                console.error(`Error while emitting event "${event}"`);
                                console.error(error.stack);
                                console.error("=====");
                            });
                        }
                    } catch (error) {
                        console.error("=====");
                        console.error(`Error while emitting event "${event}"`);
                        console.error(error.stack);
                        console.error("=====");
                    }
                }
            });
        }
        this.eventListeners.ensure(event, []);
        this.eventListeners.push(event, listener);
        return this;
    }

    /**
     * Load storage, addons, and launch the bot with the token provided.
     * @param token Token for the bot and storage.
     */
    async launch (token: string) {
        await this.storage.init(token);

        for (const addon of this.addons) addon(this);

        await this.login(token);
    }

    /**
     * Get addons matching this category.
     * @param addonType Addon type.
     */
    private getAddons () : ((client: LLLClient) => void)[] {
        try {
            const addonNames = readdirSync(this.addonDirectory);
            return addonNames.map(name => {
                try {
                    return require(join(this.addonDirectory, name));
                } catch (error) {
                    console.error(error);
                    return;
                }
            }).filter(v => v);
        } catch (error) {
            console.warn("Could not load addon directory.", error);
            return [];
        }
    }

    /**
     * Whether or not we should handle a message in our command handler.
     */
    private shouldHandleMessage (message: Message) : boolean {
        if (message.channel.type !== "text" || message.author.bot) return false; //Was this sent in an text channel and is the user a real user or not?
        const channel = message.channel as TextChannel;
        const permissions = channel.permissionsFor(this.user as ClientUser);
        if (!permissions || !permissions.has(["SEND_MESSAGES", "EMBED_LINKS"])) return false; //Do they have permissions?
        const {prefix} = this.storage.get("config", {})[message.guild.id];
        if (!message.content.toLocaleLowerCase().startsWith(prefix.toLocaleLowerCase())) return false; //Does the command start with our prefix?
        this.cooldowns.ensure(message.author.id, 0);
        return this.cooldowns.get(message.author.id) < Date.now();
    }

    private getCommandsFromInput (input: string) : Command[] {
        return this.commands.filter(command => command.name === input.toLocaleLowerCase() || (command.options.alias && command.options.alias.includes(input)));
    }

    /**
     * Create the command handler.
     */
    private createCommandHandler () {
        this.on("message", message => {
            if (!this.shouldHandleMessage(message)) return;
            const [c, ...args] = message.content.split(/ +/);
            const {prefix} = this.storage.get("config", {})[message.guild.id];
            const commands = this.getCommandsFromInput(c.slice(prefix.length));
            for (const command of commands) {
                if ((command.options.botowner && this.botowners.includes(message.author.id)) || !command.options.botowner) {
                    this.cooldowns.set(message.author.id, Date.now() + this.cooldownDelay);
                    try {
                        const callback = command.callback(message, args);
                        if (callback instanceof Promise) {
                            callback.catch(error => {
                                const permissions = (message.channel as TextChannel).permissionsFor(this.user as ClientUser);
                                if (!(error instanceof DiscordAPIError) || (error instanceof DiscordAPIError && error.code === 50013 && (!permissions || permissions.has(["SEND_MESSAGES", "EMBED_LINKS"])))) {
                                    //We got a api error. And we're missing permissions other then send messages/embed links. Or we got an non api error.
                                    console.error("=====");
                                    console.error(`Error while executing command "${command.name}"`);
                                    console.error(error.stack);
                                    console.error("=====");
                                    message.channel.send(
                                        this.embeds.error("An error has occurred and has been reported to the developer!")
                                    ).catch(() => null);
                                }
                            });
                        }
                    } catch (error) {
                        const permissions = (message.channel as TextChannel).permissionsFor(this.user as ClientUser);
                        if (!(error instanceof DiscordAPIError) || (error instanceof DiscordAPIError && error.code === 50013 && (!permissions || permissions.has(["SEND_MESSAGES", "EMBED_LINKS"])))) {
                            //We got a api error. And we're missing permissions other then send messages/embed links. Or we got an non api error.
                            console.error("=====");
                            console.error(`Error while executing command "${command.name}"`);
                            console.error(error.stack);
                            console.error("=====");
                            message.channel.send(
                                this.embeds.error("An error has occurred and has been reported to the developer!")
                            ).catch(() => null);
                        }
                    }
                    return;
                }
            }
        });
    }

    /**
     * Create the guild configuration handlers.
     */
    private createGuildConfigurationHandlers () {
        this.on("guildCreate", guild => {
            const config = this.storage.get("config", {});
            if (!config[guild.id]) {
                config[guild.id] = this.defaultSettings;
                this.storage.set("config", config);
            }
        });

        this.on("guildDelete", guild => {
            const config = this.storage.get("config", {});
            if (config[guild.id]) {
                delete config[guild.id];
                this.storage.set("config", config);
            }
        });

        this.on("ready", () => {
            const config = this.storage.get("config", {});
            const guilds = this.guilds.keyArray();
            for (const id of guilds) {
                if (!config[id]) {
                    config[id] = this.defaultSettings;
                    this.storage.set("config", config);
                }
            }
        });
    }
};
