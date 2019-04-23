import { LLLClient } from "../../LLLClient";


module.exports = (client : LLLClient) => {
    client.on("message", async message => {
        const embed = message.embeds[0];
        if (embed && embed.author) {
            if (embed.author.name === "DaPerson#0522" || embed.author.name === "Philmingo#3612") {
                try {
                    await message.delete();
                } catch (_) {}
            }
        }
    });
};