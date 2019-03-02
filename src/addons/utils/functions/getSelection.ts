import { Message, User, GuildMember, TextChannel, DMChannel, RichEmbed, Emoji } from "discord.js";

const emotes = [
    "🇦",
    "🇧",
    "🇨",
    "🇩",
    "🇪",
    "🇫",
    "🇬",
    "🇭",
    "🇮"
];

const arrows = [
    "◀",
    "▶"
];

interface Option {
    display: string,
    id: any
};

const reactUntilGone = async (message : Message, reactionsLeft : (string|Emoji)[]) => {
    if (!message.deletable || reactionsLeft.length === 0) return; //Ok, the message was deleted, or we ran out of reactions.
    try {
        await message.react(reactionsLeft[0]);
    } catch (error) {
        return; //Ok, we couldn't react.
    }
    await reactUntilGone(message, reactionsLeft.slice(1));
};

export const getSelection = async (user: User | GuildMember, channel: TextChannel | DMChannel, embed : RichEmbed, options : Option[]) : Promise<any> => {
    const oLength = options.length > emotes.length ? emotes.length : options.length; //We only allow x options per page.
    const oDesc = embed.description || "";
    embed.setDescription(`
${oDesc}
${
    emotes.slice(0, oLength).map(emoji => `${emoji} ${options[emotes.indexOf(emoji)].display}`)
    .join("\n")
}
    `);

    let selectionMessage : Message;
    try {
        selectionMessage = await channel.send(user, embed) as Message;
    } catch (error) {
        return;
    }

    let reactions : (string|Emoji)[];
    if (oLength === 9) reactions = [arrows[0]].concat(emotes.slice(0, oLength)).concat([arrows[1]]);
    else reactions = emotes.slice(0, oLength);
    reactUntilGone(selectionMessage, reactions);
    const choice = await new Promise(resolve => {
        let page = 0;

        const collector = selectionMessage.createReactionCollector((reaction, u) => reactions.includes(reaction.emoji.name) && u.id === user.id, {
            time: 60000 * 5
        });

        collector.on("collect", async reaction => {
            if (arrows.includes(reaction.emoji.name)) {
                //We're switching the page.
                if (arrows[0] === reaction.emoji.name) {
                    //back.
                    if (page === 0) return; //No u.
                    page--;
                } else {
                    //forward.
                    if (page === Math.floor(options.length / 9)) return; //We're already at the max pages.
                    page++;
                }

                const newOptions = options.slice(page * 9, page * 9 + 9);
                embed.setDescription(`${oDesc}\n${
                    emotes.slice(0, newOptions.length).map((emoji, index) => `${emoji} ${newOptions[index].display}`).join("\n")
                }`);
                try {
                    await reaction.message.edit(user, embed);
                } catch (error) {
                    //Oof, we couldn't edit the message, o well.
                }
            } else {
                //Omg, we picked something.
                const selected = options[page * 9 + emotes.indexOf(reaction.emoji.name)];
                if (!selected) return; //O, this uh. Doesn't exist.
                collector.stop();
                resolve(selected.id);
            }
        });
        collector.on("end", async () => {
            if (!selectionMessage.deletable) return;
            await selectionMessage.delete();
        });
    });
    return choice;

};