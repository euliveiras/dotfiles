"use strict";
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcome = exports.test = exports.status = exports.showReferences = exports.startLanguageServer = exports.reloadImportRegistries = exports.initializeWorkspace = exports.cache = void 0;
/** Contains handlers for commands that are enabled in Visual Studio Code for
 * the extension. */
const constants_1 = require("./constants");
const initialize_project_1 = require("./initialize_project");
const lsp_extensions_1 = require("./lsp_extensions");
const tasks = require("./tasks");
const welcome_1 = require("./welcome");
const util_1 = require("./util");
const lsp_extensions_2 = require("./lsp_extensions");
const notification_handlers_1 = require("./notification_handlers");
const server_info_1 = require("./server_info");
const semver = require("semver");
const vscode = require("vscode");
const node_1 = require("vscode-languageclient/node");
/** For the current document active in the editor tell the Deno LSP to cache
 * the file and all of its dependencies in the local cache. */
function cache(_context, extensionContext) {
    return (uris = []) => {
        const activeEditor = vscode.window.activeTextEditor;
        const client = extensionContext.client;
        if (!activeEditor || !client) {
            return;
        }
        return vscode.window.withProgress({
            location: vscode.ProgressLocation.Window,
            title: "caching",
        }, () => {
            return client.sendRequest(lsp_extensions_1.cache, {
                referrer: { uri: activeEditor.document.uri.toString() },
                uris: uris.map((uri) => ({
                    uri,
                })),
            });
        });
    };
}
exports.cache = cache;
function initializeWorkspace(_context, _extensionContext) {
    return async () => {
        try {
            const settings = await (0, initialize_project_1.pickInitWorkspace)();
            const config = vscode.workspace.getConfiguration(constants_1.EXTENSION_NS);
            await config.update("enable", true);
            await config.update("lint", settings.lint);
            await config.update("unstable", settings.unstable);
            await vscode.window.showInformationMessage("Deno is now setup in this workspace.");
        }
        catch {
            vscode.window.showErrorMessage("Deno project initialization failed.");
        }
    };
}
exports.initializeWorkspace = initializeWorkspace;
function reloadImportRegistries(_context, extensionContext) {
    return () => { var _a; return (_a = extensionContext.client) === null || _a === void 0 ? void 0 : _a.sendRequest(lsp_extensions_1.reloadImportRegistries); };
}
exports.reloadImportRegistries = reloadImportRegistries;
/** Start (or restart) the Deno Language Server */
function startLanguageServer(context, extensionContext) {
    return async () => {
        var _a;
        // Stop the existing language server and reset the state
        if (extensionContext.client) {
            const client = extensionContext.client;
            extensionContext.client = undefined;
            extensionContext.statusBar.refresh(extensionContext);
            vscode.commands.executeCommand("setContext", constants_1.ENABLEMENT_FLAG, false);
            await client.stop();
        }
        // Start a new language server
        const command = await (0, util_1.getDenoCommand)();
        const serverOptions = {
            run: {
                command,
                args: ["lsp"],
                // deno-lint-ignore no-undef
                options: { env: { ...process.env, "NO_COLOR": true } },
            },
            debug: {
                command,
                // disabled for now, as this gets super chatty during development
                // args: ["lsp", "-L", "debug"],
                args: ["lsp"],
                // deno-lint-ignore no-undef
                options: { env: { ...process.env, "NO_COLOR": true } },
            },
        };
        const client = new node_1.LanguageClient(constants_1.LANGUAGE_CLIENT_ID, constants_1.LANGUAGE_CLIENT_NAME, serverOptions, extensionContext.clientOptions);
        context.subscriptions.push(client.start());
        await client.onReady();
        // set this after a successful start
        extensionContext.client = client;
        vscode.commands.executeCommand("setContext", constants_1.ENABLEMENT_FLAG, true);
        extensionContext.serverInfo = new server_info_1.DenoServerInfo((_a = client.initializeResult) === null || _a === void 0 ? void 0 : _a.serverInfo);
        extensionContext.statusBar.refresh(extensionContext);
        context.subscriptions.push(client.onNotification(lsp_extensions_2.registryState, (0, notification_handlers_1.createRegistryStateHandler)()));
        extensionContext.tsApi.refresh();
        if (semver.valid(extensionContext.serverInfo.version) &&
            !semver.satisfies(extensionContext.serverInfo.version, constants_1.SERVER_SEMVER)) {
            notifyServerSemver(extensionContext.serverInfo.version);
        }
        else {
            showWelcomePageIfFirstUse(context, extensionContext);
        }
    };
}
exports.startLanguageServer = startLanguageServer;
function notifyServerSemver(serverVersion) {
    return vscode.window.showWarningMessage(`The version of Deno language server ("${serverVersion}") does not meet the requirements of the extension ("${constants_1.SERVER_SEMVER}"). Please update Deno and restart.`, "OK");
}
function showWelcomePageIfFirstUse(context, extensionContext) {
    var _a;
    const welcomeShown = (_a = context.globalState.get("deno.welcomeShown")) !== null && _a !== void 0 ? _a : false;
    if (!welcomeShown) {
        welcome(context, extensionContext)();
        context.globalState.update("deno.welcomeShown", true);
    }
}
function showReferences(_content, extensionContext) {
    return (uri, position, locations) => {
        if (!extensionContext.client) {
            return;
        }
        vscode.commands.executeCommand("editor.action.showReferences", vscode.Uri.parse(uri), extensionContext.client.protocol2CodeConverter.asPosition(position), locations.map(extensionContext.client.protocol2CodeConverter.asLocation));
    };
}
exports.showReferences = showReferences;
/** Open and display the "virtual document" which provides the status of the
 * Deno Language Server. */
function status(_context, _extensionContext) {
    return () => {
        const uri = vscode.Uri.parse("deno:/status.md");
        return vscode.commands.executeCommand("markdown.showPreviewToSide", uri);
    };
}
exports.status = status;
function test(_context, _extensionContext) {
    return async (uriStr, name) => {
        var _a;
        const uri = vscode.Uri.parse(uriStr, true);
        const path = uri.fsPath;
        const config = vscode.workspace.getConfiguration(constants_1.EXTENSION_NS, uri);
        const testArgs = [
            ...((_a = config.get("codeLens.testArgs")) !== null && _a !== void 0 ? _a : []),
        ];
        if (config.get("unstable")) {
            testArgs.push("--unstable");
        }
        const importMap = config.get("importMap");
        if (importMap === null || importMap === void 0 ? void 0 : importMap.trim()) {
            testArgs.push("--import-map", importMap.trim());
        }
        const env = {};
        const cacheDir = config.get("cache");
        if (cacheDir === null || cacheDir === void 0 ? void 0 : cacheDir.trim()) {
            env["DENO_DIR"] = cacheDir.trim();
        }
        const args = ["test", ...testArgs, "--filter", name, path];
        const definition = {
            type: tasks.TASK_TYPE,
            command: "test",
            args,
            cwd: ".",
            env,
        };
        (0, util_1.assert)(vscode.workspace.workspaceFolders);
        const target = vscode.workspace.workspaceFolders[0];
        const task = await tasks.buildDenoTask(target, definition, `test "${name}"`, args, ["$deno-test"]);
        task.presentationOptions = {
            reveal: vscode.TaskRevealKind.Always,
            panel: vscode.TaskPanelKind.Dedicated,
            clear: true,
        };
        task.group = vscode.TaskGroup.Test;
        return vscode.tasks.executeTask(task);
    };
}
exports.test = test;
function welcome(context, _extensionContext) {
    return () => {
        welcome_1.WelcomePanel.createOrShow(context.extensionUri);
    };
}
exports.welcome = welcome;
//# sourceMappingURL=commands.js.map