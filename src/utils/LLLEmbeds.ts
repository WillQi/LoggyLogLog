import { RichEmbed, ColorResolvable } from "discord.js";

const createDiscordEmbed = (desc: string, color: ColorResolvable) : RichEmbed => new RichEmbed().setColor(color).setDescription(desc);

const LLLEmbeds = {
    error: (desc: string) => createDiscordEmbed(desc, 0xff0000),
    info: (desc: string) => createDiscordEmbed(desc, 0xff00ff),
    success: (desc: string) => createDiscordEmbed(desc, 0x00ff00),
    custom: (desc: string, color: number) => createDiscordEmbed(desc, color)
};

export {
    LLLEmbeds
};