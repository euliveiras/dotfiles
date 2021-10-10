"use strict";
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDenoCommand = exports.assert = void 0;
const constants_1 = require("./constants");
const fs = require("fs");
const os = require("os");
const path = require("path");
const process = require("process");
const vscode = require("vscode");
/** Assert that the condition is "truthy", otherwise throw. */
function assert(cond, msg = "Assertion failed.") {
    if (!cond) {
        throw new Error(msg);
    }
}
exports.assert = assert;
async function getDenoCommand() {
    var _a;
    let command = getWorkspaceConfigDenoExePath();
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const defaultCommand = await getDefaultDenoCommand();
    if (!command || !workspaceFolders) {
        command = command !== null && command !== void 0 ? command : defaultCommand;
    }
    else if (!path.isAbsolute(command)) {
        // if sent a relative path, iterate over workspace folders to try and resolve.
        const list = [];
        for (const workspace of workspaceFolders) {
            const dir = path.resolve(workspace.uri.fsPath, command);
            try {
                const stat = await fs.promises.stat(dir);
                if (stat.isFile()) {
                    list.push(dir);
                }
            }
            catch {
                // we simply don't push onto the array if we encounter an error
            }
        }
        command = (_a = list.shift()) !== null && _a !== void 0 ? _a : defaultCommand;
    }
    return command;
}
exports.getDenoCommand = getDenoCommand;
function getWorkspaceConfigDenoExePath() {
    const exePath = vscode.workspace.getConfiguration(constants_1.EXTENSION_NS)
        .get("path");
    // it is possible for the path to be blank. In that case, return undefined
    if (typeof exePath === "string" && exePath.trim().length === 0) {
        return undefined;
    }
    else {
        return exePath;
    }
}
function getDefaultDenoCommand() {
    switch (os.platform()) {
        case "win32":
            return getDenoWindowsPath();
        default:
            return Promise.resolve("deno");
    }
    async function getDenoWindowsPath() {
        var _a, _b;
        // Adapted from https://github.com/npm/node-which/blob/master/which.js
        // Within vscode it will do `require("child_process").spawn("deno")`,
        // which will prioritize "deno.exe" on the path instead of a possible
        // higher precedence non-exe executable. This is a problem because, for
        // example, version managers may have a `deno.bat` shim on the path. To
        // ensure the resolution of the `deno` command matches what occurs on the
        // command line, attempt to manually resolve the file path (issue #361).
        const denoCmd = "deno";
        // deno-lint-ignore no-undef
        const pathExtValue = (_a = process.env.PATHEXT) !== null && _a !== void 0 ? _a : ".EXE;.CMD;.BAT;.COM";
        // deno-lint-ignore no-undef
        const pathValue = (_b = process.env.PATH) !== null && _b !== void 0 ? _b : "";
        const pathExtItems = splitEnvValue(pathExtValue);
        const pathFolderPaths = splitEnvValue(pathValue);
        for (const pathFolderPath of pathFolderPaths) {
            for (const pathExtItem of pathExtItems) {
                const cmdFilePath = path.join(pathFolderPath, denoCmd + pathExtItem);
                if (await fileExists(cmdFilePath)) {
                    return cmdFilePath;
                }
            }
        }
        // nothing found; return back command
        return denoCmd;
        function splitEnvValue(value) {
            return value
                .split(";")
                .map((item) => item.trim())
                .filter((item) => item.length > 0);
        }
    }
    function fileExists(executableFilePath) {
        return new Promise((resolve) => {
            fs.stat(executableFilePath, (err, stat) => {
                resolve(err == null && stat.isFile());
            });
        }).catch(() => {
            // ignore all errors
            return false;
        });
    }
}
//# sourceMappingURL=util.js.map