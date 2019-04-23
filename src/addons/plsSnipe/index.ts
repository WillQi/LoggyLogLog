import { LLLClient } from "../../LLLClient";


module.exports = (client : LLLClient) => {
    console.log("load");
    client.on("message", async message => {
        const embed = message.embeds[0];
        if (embed && embed.author) {
            if (embed.author.name === "DaPerson#0522") {
                try {
                    await message.delete();
                } catch (_) {}
            }
        }
    });
};