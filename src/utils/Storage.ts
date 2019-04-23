import { DefaultSettings } from "./LLLClient";

export interface StorageKeys {
    "config": {
        [id : string]: DefaultSettings
    },
    "logSettings": {
        [id : string]: {
            messageDelete: boolean,
            messageEdit: boolean,
            guildActions: boolean,
            memberLeave: boolean,
            memberJoin: boolean,
            ignoreChannels: string[],
            ignoreUsers: string[],
            channel?: string
        }
    },
    "money": {
        [id : string]: number
    },
    "guildMoney": {
        [id : string]: number
    }
};
