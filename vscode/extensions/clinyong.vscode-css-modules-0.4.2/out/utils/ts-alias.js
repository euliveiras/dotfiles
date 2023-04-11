"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToTsConfigChanges = exports.getTsAlias = exports._getAliasFromTsConfigPaths = exports._removePathsSign = void 0;
const vscode = require("vscode");
const path = require("path");
const JSON5 = require("json5");
const _ = require("lodash");
const fse = require("fs-extra");
const constants_1 = require("../constants");
const cachedMappings = new Map();
function memoize(fn) {
    function cachedFunction(workfolder) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!workfolder) {
                return Promise.resolve({});
            }
            const key = workfolder.name;
            const cachedMapping = cachedMappings.get(key);
            if (cachedMapping) {
                return cachedMapping;
            }
            else {
                const result = yield fn(workfolder);
                cachedMappings.set(key, result);
                return result;
            }
        });
    }
    return cachedFunction;
}
function invalidateCache(workfolder) {
    cachedMappings.delete(workfolder.name);
}
function _removePathsSign(paths) {
    const formatPaths = {};
    function removeEndSign(str) {
        return str.endsWith("*") ? str.slice(0, str.length - 1) : str;
    }
    Object.keys(paths).forEach((k) => {
        formatPaths[removeEndSign(k)] = paths[k].map(removeEndSign);
    });
    return formatPaths;
}
exports._removePathsSign = _removePathsSign;
function _getAliasFromTsConfigPaths(tsconfig) {
    var _a, _b;
    function removeTrailingSlash(str) {
        return str.endsWith("/") ? str.slice(0, str.length - 1) : str;
    }
    function joinPath(p) {
        return path.join(constants_1.WORKSPACE_FOLDER_VARIABLE, baseUrl, removeTrailingSlash(p));
    }
    let paths = (_a = tsconfig === null || tsconfig === void 0 ? void 0 : tsconfig.compilerOptions) === null || _a === void 0 ? void 0 : _a.paths;
    const baseUrl = (_b = tsconfig === null || tsconfig === void 0 ? void 0 : tsconfig.compilerOptions) === null || _b === void 0 ? void 0 : _b.baseUrl;
    if (!baseUrl || _.isEmpty(paths)) {
        return null;
    }
    paths = _removePathsSign(paths);
    const pathAlias = {};
    Object.keys(paths).forEach((k) => {
        pathAlias[removeTrailingSlash(k)] = paths[k].map(joinPath);
    });
    return pathAlias;
}
exports._getAliasFromTsConfigPaths = _getAliasFromTsConfigPaths;
exports.getTsAlias = memoize(function (workfolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const include = new vscode.RelativePattern(workfolder, "[tj]sconfig.json");
        const exclude = new vscode.RelativePattern(workfolder, "**/node_modules/**");
        const files = yield vscode.workspace.findFiles(include, exclude);
        let mapping = {};
        for (let i = 0; i < files.length; i++) {
            try {
                const fileContent = yield fse.readFile(files[i].fsPath, "utf8");
                const configFile = JSON5.parse(fileContent);
                const aliasFromPaths = _getAliasFromTsConfigPaths(configFile);
                if (aliasFromPaths) {
                    mapping = Object.assign({}, mapping, aliasFromPaths);
                }
            }
            catch (e) {
                console.error(e);
            }
        }
        return mapping;
    });
});
function subscribeToTsConfigChanges() {
    const disposables = [];
    for (const workfolder of vscode.workspace.workspaceFolders || []) {
        const pattern = new vscode.RelativePattern(workfolder, "[tj]sconfig.json");
        const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);
        fileWatcher.onDidChange(() => invalidateCache(workfolder));
        disposables.push(fileWatcher);
    }
    return disposables;
}
exports.subscribeToTsConfigChanges = subscribeToTsConfigChanges;
//# sourceMappingURL=ts-alias.js.map