import { getConfirmation } from "../addons/utils/functions/getConfirmation";
import { SettingsManager } from "../addons/settings/SettingsManager";
import { getSelection } from "../addons/utils/functions/getSelection";
import { MoneyManager } from "../addons/money/MoneyManager";

export interface ExportKeys {

    "money.manager": MoneyManager,
    "settings.manager": SettingsManager,
    "utils.getConfirmation": typeof getConfirmation,
    "utils.getSelection": typeof getSelection
};