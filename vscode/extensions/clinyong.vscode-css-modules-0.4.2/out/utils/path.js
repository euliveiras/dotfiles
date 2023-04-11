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
exports.findImportModule = exports.resolveImportPath = exports.genImportRegExp = void 0;
const path = require("path");
const fse = require("fs-extra");
function isPathExist(p) {
    return (fse
        .pathExists(p)
        // ignore error
        .catch(() => false));
}
function genImportRegExp(key) {
    const file = "(.+\\.(\\S{1,2}ss|stylus|styl))";
    const fromOrRequire = "(?:from\\s+|=\\s+require(?:<any>)?\\()";
    const requireEndOptional = "\\)?";
    const pattern = `\\s${key}\\s+${fromOrRequire}["']${file}["']${requireEndOptional}`;
    return new RegExp(pattern);
}
exports.genImportRegExp = genImportRegExp;
function resolveAliasPath(moduleName, aliasPrefix, aliasPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const prefix = aliasPrefix.endsWith("/") ? aliasPrefix : aliasPrefix + "/";
        const replacedModuleName = moduleName.replace(prefix, "");
        const paths = typeof aliasPath === "string" ? [aliasPath] : aliasPath;
        for (let i = 0; i < paths.length; i++) {
            const targetPath = path.resolve(paths[i], replacedModuleName);
            if (yield isPathExist(targetPath)) {
                return targetPath;
            }
        }
        return "";
    });
}
function resolveImportPath(moduleName, currentDirPath, pathAlias) {
    return __awaiter(this, void 0, void 0, function* () {
        const realPath = path.resolve(currentDirPath, moduleName);
        if (yield isPathExist(realPath)) {
            return realPath;
        }
        const aliasPrefix = Object.keys(pathAlias).find((prefix) => moduleName.startsWith(prefix));
        if (aliasPrefix) {
            const aliasPath = pathAlias[aliasPrefix];
            return resolveAliasPath(moduleName, aliasPrefix, aliasPath);
        }
        return "";
    });
}
exports.resolveImportPath = resolveImportPath;
function findImportModule(text, key) {
    const re = genImportRegExp(key);
    const results = re.exec(text);
    if (!!results && results.length > 0) {
        return results[1];
    }
    else {
        return "";
    }
}
exports.findImportModule = findImportModule;
//# sourceMappingURL=path.js.map