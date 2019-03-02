import { getConfirmation } from "../addons/utils/functions/getConfirmation";
import { SettingsManager } from "../addons/settings/SettingsManager";
import { getSelection } from "../addons/utils/functions/getSelection";

export interface ExportKeys {

    "settings.manager": SettingsManager,
    "utils.getConfirmation": typeof getConfirmation,
    "utils.getSelection": typeof getSelection
};