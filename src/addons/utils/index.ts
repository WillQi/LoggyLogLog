import { LLLClient } from "../../LLLClient";
import { getConfirmation } from "./functions/getConfirmation";
import { getSelection } from "./functions/getSelection";

module.exports = (client : LLLClient) => {
    
    client.exports.set("utils.getConfirmation", getConfirmation);
    client.exports.set("utils.getSelection", getSelection);

};