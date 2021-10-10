"use strict";
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRegistryStateHandler = void 0;
const vscode = require("vscode");
function createRegistryStateHandler() {
    return async function handler({ origin, suggestions }) {
        var _a;
        let enable = false;
        if (suggestions) {
            const selection = await vscode.window.showInformationMessage(`The server "${origin}" supports completion suggestions for imports. Do you wish to enable this? (Only do this if you trust "${origin}") [Learn More](https://github.com/denoland/vscode_deno/blob/main/docs/ImportCompletions.md)`, "No", "Enable");
            enable = selection === "Enable";
        }
        const suggestImportsConfig = vscode.workspace.getConfiguration("deno.suggest.imports");
        const hosts = (_a = suggestImportsConfig.get("hosts")) !== null && _a !== void 0 ? _a : {};
        hosts[origin] = enable;
        await suggestImportsConfig.update("hosts", hosts, vscode.ConfigurationTarget.Workspace);
    };
}
exports.createRegistryStateHandler = createRegistryStateHandler;
//# sourceMappingURL=notification_handlers.js.map