"use strict";
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTsApi = void 0;
const constants_1 = require("./constants");
const util_1 = require("./util");
const vscode = require("vscode");
function getTsApi(getPluginSettings) {
    let api;
    (async () => {
        try {
            const extension = vscode
                .extensions.getExtension(constants_1.TS_LANGUAGE_FEATURES_EXTENSION);
            const errorMessage = "The Deno extension cannot load the built in TypeScript Language Features. Please try restarting Visual Studio Code.";
            (0, util_1.assert)(extension, errorMessage);
            const languageFeatures = await extension.activate();
            api = languageFeatures.getAPI(0);
            (0, util_1.assert)(api, errorMessage);
            const pluginSettings = getPluginSettings();
            api.configurePlugin(constants_1.EXTENSION_TS_PLUGIN, pluginSettings);
        }
        catch (e) {
            const msg = `Cannot get internal TypeScript plugin configuration API.${e instanceof Error ? ` (${e.name}: ${e.message})` : ""}`;
            await vscode.window.showErrorMessage(msg);
        }
    })();
    return {
        refresh() {
            if (api) {
                const pluginSettings = getPluginSettings();
                api.configurePlugin(constants_1.EXTENSION_TS_PLUGIN, pluginSettings);
            }
        },
    };
}
exports.getTsApi = getTsApi;
//# sourceMappingURL=ts_api.js.map