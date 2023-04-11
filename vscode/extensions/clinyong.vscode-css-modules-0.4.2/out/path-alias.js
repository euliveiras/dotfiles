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
exports.getRealPathAlias = void 0;
const vscode = require("vscode");
const constants_1 = require("./constants");
const ts_alias_1 = require("./utils/ts-alias");
function valueContainsWorkspaceFolder(value) {
    return value.indexOf(constants_1.WORKSPACE_FOLDER_VARIABLE) >= 0;
}
function filterWorkspaceFolderAlias(pathAlias) {
    const newAlias = {};
    for (const key in pathAlias) {
        if (!valueContainsWorkspaceFolder(pathAlias[key])) {
            newAlias[key] = pathAlias[key];
        }
    }
    return newAlias;
}
function replaceWorkspaceFolderWithRootPath(pathAlias, rootPath) {
    function replaceAlias(alias) {
        return alias.replace(constants_1.WORKSPACE_FOLDER_VARIABLE, rootPath);
    }
    const newAlias = {};
    for (const key in pathAlias) {
        const aliasValue = pathAlias[key];
        newAlias[key] = Array.isArray(aliasValue)
            ? aliasValue.map(replaceAlias)
            : replaceAlias(aliasValue);
    }
    return newAlias;
}
function getRealPathAlias(pathAliasOptions, doc) {
    return __awaiter(this, void 0, void 0, function* () {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(doc.uri);
        if (workspaceFolder) {
            const tsAlias = yield ts_alias_1.getTsAlias(workspaceFolder);
            // Alias from extension option has higher priority.
            const alias = Object.assign({}, tsAlias, pathAliasOptions);
            return replaceWorkspaceFolderWithRootPath(alias, workspaceFolder.uri.fsPath);
        }
        else {
            return filterWorkspaceFolderAlias(pathAliasOptions);
        }
    });
}
exports.getRealPathAlias = getRealPathAlias;
//# sourceMappingURL=path-alias.js.map