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
exports.createBracketCompletionItem = exports.isKebabCaseClassName = exports.dashesCamelCase = exports.getAllClassNames = exports.getCurrentLine = void 0;
const vscode_1 = require("vscode");
const fse = require("fs-extra");
const _ = require("lodash");
function getCurrentLine(document, position) {
    return document.getText(document.lineAt(position).range);
}
exports.getCurrentLine = getCurrentLine;
/**
 * @TODO Refact by new Tokenizer
 */
function getAllClassNames(filePath, keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        // check file exists, if not just return []
        const filePathStat = yield fse.stat(filePath);
        if (!filePathStat.isFile()) {
            return [];
        }
        const content = yield fse.readFile(filePath, { encoding: "utf8" });
        let matchLineRegexp = /.*[,{]/g;
        // experimental stylus support
        if (filePath.endsWith(".styl") || filePath.endsWith(".stylus")) {
            matchLineRegexp = /\..*/g;
        }
        const lines = content.match(matchLineRegexp);
        if (lines === null) {
            return [];
        }
        const classNames = lines.join(" ").match(/\.[_A-Za-z0-9-]+/g);
        if (classNames === null) {
            return [];
        }
        const uniqNames = _.uniq(classNames).map((item) => item.slice(1)).filter((item) => !/^[0-9]/.test(item));
        return keyword !== ""
            ? uniqNames.filter((item) => item.indexOf(keyword) !== -1)
            : uniqNames;
    });
}
exports.getAllClassNames = getAllClassNames;
// from css-loader's implementation
// source: https://github.com/webpack-contrib/css-loader/blob/22f6621a175e858bb604f5ea19f9860982305f16/lib/compile-exports.js
function dashesCamelCase(str) {
    return str.replace(/-(\w)/g, function (match, firstLetter) {
        return firstLetter.toUpperCase();
    });
}
exports.dashesCamelCase = dashesCamelCase;
/**
 * check kebab-case classname
 */
function isKebabCaseClassName(className) {
    return className === null || className === void 0 ? void 0 : className.includes('-');
}
exports.isKebabCaseClassName = isKebabCaseClassName;
/**
 * BracketCompletionItem Factory
 */
function createBracketCompletionItem(className, position) {
    const completionItem = new vscode_1.CompletionItem(className, vscode_1.CompletionItemKind.Variable);
    completionItem.detail = `['${className}']`;
    completionItem.documentation = "kebab-casing may cause unexpected behavior when trying to access style.class-name as a dot notation. You can still work around kebab-case with bracket notation (eg. style['class-name']) but style.className is cleaner.";
    completionItem.insertText = `['${className}']`;
    completionItem.additionalTextEdits = [new vscode_1.TextEdit(new vscode_1.Range(new vscode_1.Position(position.line, position.character - 1), new vscode_1.Position(position.line, position.character)), '')];
    return completionItem;
}
exports.createBracketCompletionItem = createBracketCompletionItem;
//# sourceMappingURL=index.js.map