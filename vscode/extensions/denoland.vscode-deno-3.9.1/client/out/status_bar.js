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
var _DenoStatusBar_inner;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DenoStatusBar = void 0;
const vscode = require("vscode");
class DenoStatusBar {
    constructor() {
        _DenoStatusBar_inner.set(this, void 0);
        __classPrivateFieldSet(this, _DenoStatusBar_inner, vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0), "f");
    }
    dispose() {
        __classPrivateFieldGet(this, _DenoStatusBar_inner, "f").dispose();
    }
    refresh(extensionContext) {
        if (extensionContext.serverInfo) {
            __classPrivateFieldGet(this, _DenoStatusBar_inner, "f").text = `Deno ${extensionContext.serverInfo.version}`;
            __classPrivateFieldGet(this, _DenoStatusBar_inner, "f").tooltip = extensionContext.serverInfo.versionWithBuildInfo;
        }
        // show only when "enable" is true and language server started
        if (extensionContext.workspaceSettings.enable &&
            extensionContext.client &&
            extensionContext.serverInfo) {
            __classPrivateFieldGet(this, _DenoStatusBar_inner, "f").show();
        }
        else {
            __classPrivateFieldGet(this, _DenoStatusBar_inner, "f").hide();
        }
    }
}
exports.DenoStatusBar = DenoStatusBar;
_DenoStatusBar_inner = new WeakMap();
//# sourceMappingURL=status_bar.js.map