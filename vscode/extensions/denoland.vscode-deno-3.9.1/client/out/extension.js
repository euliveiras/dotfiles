"use strict";
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const commands = require("./commands");
const constants_1 = require("./constants");
const content_provider_1 = require("./content_provider");
const debug_config_provider_1 = require("./debug_config_provider");
const status_bar_1 = require("./status_bar");
const tasks_1 = require("./tasks");
const ts_api_1 = require("./ts_api");
const util_1 = require("./util");
const path = require("path");
const vscode = require("vscode");
/** The language IDs we care about. */
const LANGUAGES = [
    "typescript",
    "javascript",
    "typescriptreact",
    "javascriptreact",
];
/** These are keys of settings that have a scope of window or machine. */
const workspaceSettingsKeys = [
    "cache",
    "codeLens",
    "config",
    "importMap",
    "internalDebug",
    "lint",
    "suggest",
    "unstable",
];
/** These are keys of settings that can apply to an individual resource, like
 * a file or folder. */
const resourceSettingsKeys = [
    "enable",
    "codeLens",
];
/** Convert a workspace configuration to `Settings` for a workspace. */
function configToWorkspaceSettings(config) {
    var _a, _b, _c, _d, _e, _f;
    const workspaceSettings = Object.create(null);
    for (const key of workspaceSettingsKeys) {
        const value = config.inspect(key);
        (0, util_1.assert)(value);
        workspaceSettings[key] = (_c = (_b = (_a = value.workspaceLanguageValue) !== null && _a !== void 0 ? _a : value.workspaceValue) !== null && _b !== void 0 ? _b : value.globalValue) !== null && _c !== void 0 ? _c : value.defaultValue;
    }
    for (const key of resourceSettingsKeys) {
        const value = config.inspect(key);
        (0, util_1.assert)(value);
        workspaceSettings[key] = (_f = (_e = (_d = value.workspaceLanguageValue) !== null && _d !== void 0 ? _d : value.workspaceValue) !== null && _e !== void 0 ? _e : value.globalValue) !== null && _f !== void 0 ? _f : value.defaultValue;
    }
    return workspaceSettings;
}
/** Convert a workspace configuration to settings that apply to a resource. */
function configToResourceSettings(config) {
    var _a, _b, _c, _d, _e;
    const resourceSettings = Object.create(null);
    for (const key of resourceSettingsKeys) {
        const value = config.inspect(key);
        (0, util_1.assert)(value);
        resourceSettings[key] = (_e = (_d = (_c = (_b = (_a = value.workspaceFolderLanguageValue) !== null && _a !== void 0 ? _a : value.workspaceFolderValue) !== null && _b !== void 0 ? _b : value.workspaceLanguageValue) !== null && _c !== void 0 ? _c : value.workspaceValue) !== null && _d !== void 0 ? _d : value.globalValue) !== null && _e !== void 0 ? _e : value.defaultValue;
    }
    return resourceSettings;
}
function getWorkspaceSettings() {
    const config = vscode.workspace.getConfiguration(constants_1.EXTENSION_NS);
    return configToWorkspaceSettings(config);
}
function handleConfigurationChange(event) {
    var _a;
    if (event.affectsConfiguration(constants_1.EXTENSION_NS)) {
        (_a = extensionContext.client) === null || _a === void 0 ? void 0 : _a.sendNotification("workspace/didChangeConfiguration", 
        // We actually set this to empty because the language server will
        // call back and get the configuration. There can be issues with the
        // information on the event not being reliable.
        { settings: null });
        extensionContext.workspaceSettings = getWorkspaceSettings();
        for (const [key, { scope }] of Object.entries(extensionContext.documentSettings)) {
            extensionContext.documentSettings[key] = {
                scope,
                settings: configToResourceSettings(vscode.workspace.getConfiguration(constants_1.EXTENSION_NS, scope)),
            };
        }
        extensionContext.tsApi.refresh();
        extensionContext.statusBar.refresh(extensionContext);
        // restart when "deno.path" changes
        if (event.affectsConfiguration("deno.path")) {
            vscode.commands.executeCommand("deno.restart");
        }
    }
}
function handleDocumentOpen(...documents) {
    let didChange = false;
    for (const doc of documents) {
        if (!LANGUAGES.includes(doc.languageId)) {
            continue;
        }
        const { languageId, uri } = doc;
        extensionContext.documentSettings[path.normalize(doc.uri.fsPath)] = {
            scope: { languageId, uri },
            settings: configToResourceSettings(vscode.workspace.getConfiguration(constants_1.EXTENSION_NS, { languageId, uri })),
        };
        didChange = true;
    }
    if (didChange) {
        extensionContext.tsApi.refresh();
    }
}
const extensionContext = {};
/** When the extension activates, this function is called with the extension
 * context, and the extension bootstraps itself. */
async function activate(context) {
    extensionContext.clientOptions = {
        documentSelector: [
            { scheme: "file", language: "javascript" },
            { scheme: "file", language: "javascriptreact" },
            { scheme: "file", language: "typescript" },
            { scheme: "file", language: "typescriptreact" },
            { scheme: "deno", language: "javascript" },
            { scheme: "deno", language: "javascriptreact" },
            { scheme: "deno", language: "typescript" },
            { scheme: "deno", language: "typescriptreact" },
            { scheme: "file", language: "json" },
            { scheme: "file", language: "jsonc" },
            { scheme: "file", language: "markdown" },
        ],
        diagnosticCollectionName: "deno",
        initializationOptions: getWorkspaceSettings(),
    };
    // When a document opens, the language server will query the client to
    // determine the specific configuration of a resource, we need to ensure the
    // the builtin TypeScript language service has the same "view" of the world,
    // so when Deno is enabled, we need to disable the built in language service,
    // but this is determined on a file by file basis.
    vscode.workspace.onDidOpenTextDocument(handleDocumentOpen, extensionContext, context.subscriptions);
    // Send a notification to the language server when the configuration changes
    // as well as update the TypeScript language service plugin
    vscode.workspace.onDidChangeConfiguration(handleConfigurationChange, extensionContext, context.subscriptions);
    extensionContext.statusBar = new status_bar_1.DenoStatusBar();
    context.subscriptions.push(extensionContext.statusBar);
    // Register a content provider for Deno resolved read-only files.
    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(content_provider_1.SCHEME, new content_provider_1.DenoTextDocumentContentProvider(extensionContext)));
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider("deno", new debug_config_provider_1.DenoDebugConfigurationProvider(getWorkspaceSettings)));
    // Activate the task provider.
    context.subscriptions.push((0, tasks_1.activateTaskProvider)());
    // Register any commands.
    const registerCommand = createRegisterCommand(context);
    registerCommand("cache", commands.cache);
    registerCommand("initializeWorkspace", commands.initializeWorkspace);
    registerCommand("restart", commands.startLanguageServer);
    registerCommand("reloadImportRegistries", commands.reloadImportRegistries);
    registerCommand("showReferences", commands.showReferences);
    registerCommand("status", commands.status);
    registerCommand("test", commands.test);
    registerCommand("welcome", commands.welcome);
    extensionContext.tsApi = (0, ts_api_1.getTsApi)(() => ({
        documents: extensionContext.documentSettings,
        workspace: extensionContext.workspaceSettings,
    }));
    extensionContext.documentSettings = {};
    extensionContext.workspaceSettings = getWorkspaceSettings();
    // when we activate, it might have been because a document was opened that
    // activated us, which we need to grab the config for and send it over to the
    // plugin
    handleDocumentOpen(...vscode.workspace.textDocuments);
    await commands.startLanguageServer(context, extensionContext)();
}
exports.activate = activate;
function deactivate() {
    if (!extensionContext.client) {
        return undefined;
    }
    const client = extensionContext.client;
    extensionContext.client = undefined;
    extensionContext.statusBar.refresh(extensionContext);
    vscode.commands.executeCommand("setContext", constants_1.ENABLEMENT_FLAG, false);
    return client.stop();
}
exports.deactivate = deactivate;
/** Internal function factory that returns a registerCommand function that is
 * bound to the extension context. */
function createRegisterCommand(context) {
    return function registerCommand(name, factory) {
        const fullName = `${constants_1.EXTENSION_NS}.${name}`;
        const command = factory(context, extensionContext);
        context.subscriptions.push(vscode.commands.registerCommand(fullName, command));
    };
}
//# sourceMappingURL=extension.js.map