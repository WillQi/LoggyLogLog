import Enmap from "enmap";
import { StorageKeys } from "./utils/Storage";
import { createCipheriv, createHash, createDecipheriv } from "crypto";
import { readdirSync, mkdirSync } from "fs";

export class LLLStorage {

    private enmap: Enmap;

    private key?: string;

    constructor (databaseDirectory: string) {

        try {
            readdirSync(databaseDirectory);
        } catch (e) {
            try {
                mkdirSync(databaseDirectory);
            } catch (error) {
                throw new Error("I'm unable to create a database folder as one does not exist.");
            }
        }

        this.enmap = new Enmap({
            dataDir: databaseDirectory,
            name: "storage"
        });
    }

    async init(key: string) {
        await this.enmap.defer;
        this.key = key;
    }

    get<StorageKey extends keyof StorageKeys> (key: StorageKey, fallback: StorageKeys[StorageKey]) : StorageKeys[StorageKey] {
        const data = this.enmap.get(key);
        if (!data) return fallback;
        const decrypted = this.decrypt(data.encrypted, Buffer.from(data.IV, "hex"));
        return decrypted;
    }

    set<StorageKey extends keyof StorageKeys> (key: StorageKey, val: StorageKeys[StorageKey]) {
        const data = this.encrypt(val);
        this.enmap.set(key, data);
    }

    private encrypt (val: any) {
        if (!this.key) throw new Error("Cannot encrypt any value without a key set.");
        const stringified = JSON.stringify(val);
        const IV = Buffer.from(
            createHash("md5")
                .update(Math.random().toLocaleString())
                .digest("hex"),
            "hex"
        );
        const cipher = createCipheriv(
            "aes-256-ctr",
            createHash("md5")
                .update(this.key)
                .digest("hex")
            ,
            IV
        );
        let encrypted = cipher.update(stringified, "utf8", "hex");
        encrypted += cipher.final("hex");
        return {
            encrypted,
            IV: IV.toString("hex")
        };

    }

    private decrypt (val: string, IV: Buffer) {
        if (!this.key) throw new Error("Cannot decrypt any value without a key set.");
        const cipher = createDecipheriv(
            "aes-256-ctr",
            createHash("md5")
                .update(this.key)
                .digest("hex"),
            IV
        );
        const data = cipher.update(val, "hex", "utf8");
        return JSON.parse(data);
    }
};
