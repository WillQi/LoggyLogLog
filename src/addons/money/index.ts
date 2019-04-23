import { MoneyManager } from "./MoneyManager";
import { Util } from "discord.js";
import { LLLClient } from "../../LLLClient";
import { CommandCategories } from "../../utils/LLLClient";

module.exports = (client : LLLClient) => {
    
    client.exports.set("money.manager", new MoneyManager(client.storage));

    client.addCommand("money", {
        alias: ["balance", "bal"],
        category: CommandCategories.ECONOMY_COMMANDS,
        description: "View all the dollars you have."
    }, message => {
        const MM = client.exports.get("money.manager");
        return message.channel.send(
            client.embeds.info(`**${Util.escapeMarkdown(message.author.tag)}** has ${MM.get(message.author)} dollars.`)
        );
    });

};