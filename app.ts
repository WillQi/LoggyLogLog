import { BOTOWNERS, COOLDOWN, DEFAULT_SETTINGS, TOKEN } from "./config.json";
import { LLLClient } from "./src/LLLClient";
import { join } from "path";

const client = new LLLClient({
    databaseDirectory: join(__dirname, "database"),
    addonDirectory: join(__dirname, "src", "addons"),
    botowners: BOTOWNERS,
    cooldown: COOLDOWN,
    defaultSettings: DEFAULT_SETTINGS,
    disableEveryone: true
});

client.launch(TOKEN);