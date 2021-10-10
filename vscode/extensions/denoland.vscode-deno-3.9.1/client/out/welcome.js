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
var _WelcomePanel_panel, _WelcomePanel_extensionUri, _WelcomePanel_mediaRoot, _WelcomePanel_disposables, _WelcomePanel_update, _WelcomePanel_getHtmlForWebview;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomePanel = void 0;
const constants_1 = require("./constants");
const vscode = require("vscode");
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
class WelcomePanel {
    constructor(panel, extensionUri) {
        _WelcomePanel_panel.set(this, void 0);
        _WelcomePanel_extensionUri.set(this, void 0);
        _WelcomePanel_mediaRoot.set(this, void 0);
        _WelcomePanel_disposables.set(this, []);
        _WelcomePanel_update.set(this, () => {
            const { webview } = __classPrivateFieldGet(this, _WelcomePanel_panel, "f");
            __classPrivateFieldGet(this, _WelcomePanel_panel, "f").webview.html = __classPrivateFieldGet(this, _WelcomePanel_getHtmlForWebview, "f").call(this, webview);
        });
        _WelcomePanel_getHtmlForWebview.set(this, (webview) => {
            const scriptPath = vscode.Uri.joinPath(__classPrivateFieldGet(this, _WelcomePanel_mediaRoot, "f"), "welcome.js");
            const stylesPath = vscode.Uri.joinPath(__classPrivateFieldGet(this, _WelcomePanel_mediaRoot, "f"), "welcome.css");
            const logoPath = vscode.Uri.joinPath(__classPrivateFieldGet(this, _WelcomePanel_extensionUri, "f"), "deno.png");
            const denoExtension = vscode.extensions.getExtension(constants_1.EXTENSION_ID);
            const denoExtensionVersion = denoExtension.packageJSON.version;
            const scriptURI = webview.asWebviewUri(scriptPath);
            const stylesURI = webview.asWebviewUri(stylesPath);
            const logoURI = webview.asWebviewUri(logoPath);
            const nonce = getNonce();
            return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <!--
          Use a CSP that only allows loading images from https or from our
          extension directory and only allows scripts that have a specific nonce
        -->
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${stylesURI}" rel="stylesheet">
        <title>Deno for VSCode</title>
      </head>
      <body>
      <main class="Content">
      <div class="Header">
        <img src="${logoURI}" alt="Deno Extension Logo" class="Header-logo" />
        <div class="Header-details">
          <h1 class="Header-title">Deno for VSCode v${denoExtensionVersion}</h1>
          <p>The official Deno extension for Visual Studio Code, powered by the Deno Language Server.</p>
          <ul class="Header-links">
            <li><a href="#" class="Command" data-command="openDocument" data-document="CHANGELOG.md">Change Log</a></li>
            <li><a href="https://github.com/denoland/vscode_deno/">GitHub</a></li>
            <li><a href="https://discord.gg/deno">Discord</a></li>
          </ul>
        </div>
      </div>
      
      <div class="Cards">
        <div class="Card">
          <div class="Card-inner">
          <p class="Card-title">Enabling Deno</p>
          <p class="Card-content">
            <p>
              The extension does not assume it applies to all workspaces you use
              with VSCode. You can enable Deno in a workspace by running the
              <em><a href="#" class="Command" data-command="init">Deno:
              Initialize Workspace Configuration</a></em> command.
            </p>
            <p>
              You can also enable or disable it in the
              <a href="#" class="Command" data-command="openSetting" data-setting="deno.enable">settings</a>.
              <em>It is not recommended to enable it globally, unless of course
              you only edit Deno projects with VSCode.</em>
            </p>
          </p>
          </div>
        </div>

        <div class="Card">
          <div class="Card-inner">
            <p class="Card-title">Getting started with Deno</p>
            <p class="Card-content">
              If you are new to Deno, check out the
              <a href="https://deno.land/manual/getting_started">getting started
              section</a> of the Deno manual.
            </p>
          </div>
        </div>
      </div>
      </main>
      
      <script nonce="${nonce}" src="${scriptURI}"></script>
      </body>
      </html>`;
        });
        __classPrivateFieldSet(this, _WelcomePanel_panel, panel, "f");
        __classPrivateFieldSet(this, _WelcomePanel_extensionUri, extensionUri, "f");
        __classPrivateFieldSet(this, _WelcomePanel_mediaRoot, vscode.Uri.joinPath(__classPrivateFieldGet(this, _WelcomePanel_extensionUri, "f"), "media"), "f");
        __classPrivateFieldGet(this, _WelcomePanel_update, "f").call(this);
        __classPrivateFieldGet(this, _WelcomePanel_panel, "f").onDidDispose(() => this.dispose(), null, __classPrivateFieldGet(this, _WelcomePanel_disposables, "f"));
        __classPrivateFieldGet(this, _WelcomePanel_panel, "f").webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case "openDocument": {
                    const uri = vscode.Uri.joinPath(__classPrivateFieldGet(this, _WelcomePanel_extensionUri, "f"), message.document);
                    vscode.commands.executeCommand("markdown.showPreviewToSide", uri);
                    return;
                }
                case "openSetting": {
                    vscode.commands.executeCommand("workbench.action.openSettings", message.setting);
                    return;
                }
                case "init": {
                    vscode.commands.executeCommand("deno.initializeWorkspace");
                    return;
                }
            }
        }, null, __classPrivateFieldGet(this, _WelcomePanel_disposables, "f"));
    }
    dispose() {
        WelcomePanel.currentPanel = undefined;
        __classPrivateFieldGet(this, _WelcomePanel_panel, "f").dispose();
        for (const handle of __classPrivateFieldGet(this, _WelcomePanel_disposables, "f")) {
            if (handle) {
                handle.dispose();
            }
        }
    }
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (WelcomePanel.currentPanel) {
            __classPrivateFieldGet(WelcomePanel.currentPanel, _WelcomePanel_panel, "f").reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel(WelcomePanel.viewType, "Deno for VSCode", column !== null && column !== void 0 ? column : vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(extensionUri)],
        });
        panel.iconPath = vscode.Uri.joinPath(extensionUri, "deno.png");
        WelcomePanel.currentPanel = new WelcomePanel(panel, extensionUri);
    }
    static revive(panel, extensionUri) {
        WelcomePanel.currentPanel = new WelcomePanel(panel, extensionUri);
    }
}
exports.WelcomePanel = WelcomePanel;
_WelcomePanel_panel = new WeakMap(), _WelcomePanel_extensionUri = new WeakMap(), _WelcomePanel_mediaRoot = new WeakMap(), _WelcomePanel_disposables = new WeakMap(), _WelcomePanel_update = new WeakMap(), _WelcomePanel_getHtmlForWebview = new WeakMap();
WelcomePanel.viewType = "welcomeDeno";
//# sourceMappingURL=welcome.js.map