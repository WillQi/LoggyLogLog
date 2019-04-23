import { UserResolvable, GuildResolvable } from "discord.js";
import { LLLStorage } from "../../LLLStorage";

const STORAGE_KEY = "money";
const GUILD_STORAGE_KEY = "guildMoney";

class MoneyManager {

    private storage : LLLStorage;

    private balances : {
        [id : string]: number
    };

    private guildBalances : {
        [id : string]: number
    };

    constructor (storage : LLLStorage) {
        this.storage = storage;
        this.balances = storage.get(STORAGE_KEY, {});
        this.guildBalances = storage.get(GUILD_STORAGE_KEY, {});
    }

    get (userResolvable : UserResolvable) {
        const id = this.resolve(userResolvable);
        return this.balances[id] || 0;
    }

    getGuild (guildResolvable : GuildResolvable) {
        const id = this.resolve(guildResolvable);
        return this.guildBalances[id] || 0;
    }
    
    set (userResolvable : UserResolvable, amount : number) {
        const id = this.resolve(userResolvable);
        this.balances[id] = amount;
        this.save();
        return amount;
    }

    setGuild (guildResolvable : GuildResolvable, amount : number) {
        const id = this.resolve(guildResolvable);
        this.guildBalances[id] = amount;
        this.save();
        return amount;
    }

    add (userResolvable : UserResolvable, amount : number) {
        const id = this.resolve(userResolvable);
        this.balances[id] = (this.balances[id] || 0) + amount;
        this.save();
        return this.balances[id];
    }

    addGuild (guildResolvable : GuildResolvable, amount : number) {
        const id = this.resolve(guildResolvable);
        this.guildBalances[id] = (this.guildBalances[id] || 0) + amount;
        this.save();
        return this.guildBalances[id];
    }

    private resolve (userResolvable : UserResolvable) {
        return typeof userResolvable === "string" ? userResolvable : userResolvable.id;
    }

    private save () {
        this.storage.set(STORAGE_KEY, this.balances);
        this.storage.set(GUILD_STORAGE_KEY, this.guildBalances);
    }
}

export {
    MoneyManager
};