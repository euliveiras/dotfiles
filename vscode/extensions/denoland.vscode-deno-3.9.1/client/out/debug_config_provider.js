"use strict";
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DenoDebugConfigurationProvider_instances, _DenoDebugConfigurationProvider_getSettings, _DenoDebugConfigurationProvider_getEnv, _DenoDebugConfigurationProvider_getAdditionalRuntimeArgs;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DenoDebugConfigurationProvider = void 0;
const util_1 = require("./util");
const vscode = require("vscode");
class DenoDebugConfigurationProvider {
    constructor(getSettings) {
        _DenoDebugConfigurationProvider_instances.add(this);
        _DenoDebugConfigurationProvider_getSettings.set(this, void 0);
        __classPrivateFieldSet(this, _DenoDebugConfigurationProvider_getSettings, getSettings, "f");
    }
    async provideDebugConfigurations() {
        return [
            {
                request: "launch",
                name: "Launch Program",
                type: "pwa-node",
                program: "${workspaceFolder}/main.ts",
                cwd: "${workspaceFolder}",
                env: __classPrivateFieldGet(this, _DenoDebugConfigurationProvider_instances, "m", _DenoDebugConfigurationProvider_getEnv).call(this),
                runtimeExecutable: await (0, util_1.getDenoCommand)(),
                runtimeArgs: [
                    "run",
                    ...__classPrivateFieldGet(this, _DenoDebugConfigurationProvider_instances, "m", _DenoDebugConfigurationProvider_getAdditionalRuntimeArgs).call(this),
                    "--inspect",
                    "--allow-all",
                ],
                attachSimplePort: 9229,
            },
        ];
    }
    async resolveDebugConfiguration(workspace, config) {
        // if launch.json is missing or empty
        if (!config.type && !config.request && !config.name) {
            const editor = vscode.window.activeTextEditor;
            const langId = editor === null || editor === void 0 ? void 0 : editor.document.languageId;
            if (editor &&
                (langId === "typescript" || langId === "javascript" ||
                    langId === "typescriptreact" || langId === "javascriptreact")) {
                // https://github.com/microsoft/vscode/issues/106703#issuecomment-694595773
                // Bypass the bug of the vscode 1.49.0
                vscode.debug.startDebugging(workspace, {
                    request: "launch",
                    name: "Launch Program",
                    type: "pwa-node",
                    program: "${file}",
                    env: __classPrivateFieldGet(this, _DenoDebugConfigurationProvider_instances, "m", _DenoDebugConfigurationProvider_getEnv).call(this),
                    runtimeExecutable: await (0, util_1.getDenoCommand)(),
                    runtimeArgs: [
                        "run",
                        ...__classPrivateFieldGet(this, _DenoDebugConfigurationProvider_instances, "m", _DenoDebugConfigurationProvider_getAdditionalRuntimeArgs).call(this),
                        "--inspect",
                        "--allow-all",
                    ],
                    attachSimplePort: 9229,
                });
                return undefined;
            }
            return null;
        }
        if (!config.program) {
            await vscode.window.showErrorMessage("Cannot resolve a program to debug");
            return undefined;
        }
        return config;
    }
}
exports.DenoDebugConfigurationProvider = DenoDebugConfigurationProvider;
_DenoDebugConfigurationProvider_getSettings = new WeakMap(), _DenoDebugConfigurationProvider_instances = new WeakSet(), _DenoDebugConfigurationProvider_getEnv = function _DenoDebugConfigurationProvider_getEnv() {
    const cache = __classPrivateFieldGet(this, _DenoDebugConfigurationProvider_getSettings, "f").call(this).cache;
    return cache ? { "DENO_DIR": cache } : undefined;
}, _DenoDebugConfigurationProvider_getAdditionalRuntimeArgs = function _DenoDebugConfigurationProvider_getAdditionalRuntimeArgs() {
    const args = [];
    const settings = __classPrivateFieldGet(this, _DenoDebugConfigurationProvider_getSettings, "f").call(this);
    if (settings.unstable) {
        args.push("--unstable");
    }
    if (settings.importMap) {
        args.push("--import-map");
        args.push(settings.importMap.trim());
    }
    if (settings.config) {
        args.push("--config");
        args.push(settings.config.trim());
    }
    return args;
};
//# sourceMappingURL=debug_config_provider.js.map