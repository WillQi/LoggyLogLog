import { ExportKeys } from "./utils/Exports";

export class LLLExports {

    private exports: Map<string, any>;

    constructor () {
        this.exports = new Map();
    }

    get<ExportKey extends keyof ExportKeys> (key: ExportKey) : ExportKeys[ExportKey] {
        return this.exports.get(key);
    }

    set<ExportKey extends keyof ExportKeys> (key: ExportKey, value: ExportKeys[ExportKey]) {
        return this.exports.set(key, value);
    }
};
