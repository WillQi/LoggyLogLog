import { LLLClient } from "../../LLLClient";
import { TextChannel } from "discord.js";


module.exports = (client : LLLClient) => {
    client.on("message", async message => {
        const embed = message.embeds[0];
        if (embed && embed.author) {
            if (embed.author.name === "DaPerson#0522" || embed.author.name === "Philmingo#3612" || (embed.author.name === "Derrick#3902" && !(message.channel as TextChannel).name.includes("logs"))) {
                try {
                    await message.delete();
                } catch (_) {}
            }
        }
    });
};