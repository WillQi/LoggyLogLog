import { LLLClient } from "../../LLLClient";

module.exports = (client : LLLClient) => {
    client.addCommand("eval", {
        botowner: true,
        hide: true
    }, async (message, args) => {
        const content = args.join(" ");
        await eval(content);
        await message.reply(
            client.embeds.success("Success!")
        )
    });
};