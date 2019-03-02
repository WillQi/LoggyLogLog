import { DMChannel, TextChannel, MessageOptions, RichEmbed, Attachment, Message, User, GuildMember } from "discord.js";

const getConfirmation = async (channel: TextChannel|DMChannel, user: User|GuildMember, toSend : MessageOptions|RichEmbed|Attachment) => {
    let message;
    try {
        message = await channel.send(toSend) as Message;
        await message.react("✅");
        await message.react("❌");
    } catch (_) {
        return false;
    }
    const reaction = (await message.awaitReactions((reaction, u) => u.id === user.id && ["✅", "❌"].includes(reaction.emoji.name), {
        max: 1
    })).first();
    
    if (message.deletable) {
        try {
            await message.delete();
        } catch (_) {}
    }

    if (reaction) {
        return reaction.emoji.name === "✅";
    }
    return false;
};

export {
    getConfirmation
};