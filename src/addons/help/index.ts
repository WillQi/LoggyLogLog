/**
 * Manages the help command and displaying a message if the bot is mentioned.
 */
import { Util } from "discord.js";
import { LLLClient } from "../../LLLClient";
import { CommandCategories, Command } from "../../utils/LLLClient";

module.exports = (client : LLLClient) => {

    client.on("message", message => {
        if (message.isMentioned(client.user) && message.channel.type === "text") {
            const prefix = client.storage.get("config", {})[message.guild.id].prefix;
            message.channel.send(client.embeds.info(`View my commands via \`${prefix}help\``));
        }
    });
    
    client.addCommand("help", {
        category: CommandCategories.GENERAL_COMMANDS,
        description: "View all the commands"
    }, async message => {
        const prefix = client.storage.get("config", {})[message.guild.id].prefix;

        const embed = client.embeds.info(`The prefix for this server is \`${Util.escapeMarkdown(prefix)}\``)
            .setTitle("LoggyLogLog | Commands")
            .setFooter(`To use a command: type ${prefix}commandName`);
        
        const categories : {[category : string]: Command[]} = {};
        for (const command of client.commands) {
            if (command.options.category && !command.options.hide && !command.options.botowner) {
                if (categories[command.options.category]) {
                    categories[command.options.category].push(command);
                } else {
                    categories[command.options.category] = [command];
                }
            }
        }

        for (const category in categories) {
            embed.addField(category, categories[category].map(command => `\`${command.name}\` - ${command.options.description}`).join("\n"));
        }
        
        try {
            await message.author.send(embed);
        } catch (_) {
            message.channel.send("I was unable to send you a DM with a list of all the commands. Please try again when I can send you a DM.");
            return;
        }
        message.channel.send("I sent you a DM with all the commands!");
    });

};