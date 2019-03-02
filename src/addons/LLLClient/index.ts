/**
 * Listeners.
 */
import { LLLClient } from "../../LLLClient";


//https://discordapp.com/oauth2/authorize?client_id=551243338741973003&scope=bot&permissions=19584


module.exports = (client : LLLClient) => {
    
    client.on("disconnect", () => console.log(`${client.user.tag} has disconnected.`));
    client.on("reconnecting", () => console.log(`${client.user.tag} is reconnecting...`));
    client.on("error", error => console.log(`${client.user.tag} has had a connection error: ${error.message}`));
    client.on("warn", console.warn);
    client.on("ready", async () => {
        console.log(`${client.user.tag} is online and is stalking chat!`);
        try {
            await client.user.setActivity("Don't mind me! | l!help");
        } catch (_) {}
    });

};