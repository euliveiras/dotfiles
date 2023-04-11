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
exports.CSSModuleCompletionProvider = void 0;
const vscode_1 = require("vscode");
const path = require("path");
const _ = require("lodash");
const utils_1 = require("./utils");
const path_1 = require("./utils/path");
const path_alias_1 = require("./path-alias");
// check if current character or last character is .
function isTrigger(line, position) {
    const i = position.character - 1;
    return line[i] === "." || (i > 1 && line[i - 1] === ".");
}
function getWords(line, position) {
    const text = line.slice(0, position.character);
    // support optional chain https://github.com/tc39/proposal-optional-chaining
    // covert ?. to .
    const convertText = text.replace(/(\?\.)/g, '.');
    const index = convertText.search(/[a-zA-Z0-9._]*$/);
    if (index === -1) {
        return "";
    }
    return convertText.slice(index);
}
class CSSModuleCompletionProvider {
    constructor(options) {
        this._classTransformer = null;
        switch (options.camelCase) {
            case true:
                this._classTransformer = _.camelCase;
                break;
            case "dashes":
                this._classTransformer = utils_1.dashesCamelCase;
                break;
            default:
                break;
        }
        this.pathAliasOptions = options.pathAlias;
    }
    provideCompletionItems(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentLine = utils_1.getCurrentLine(document, position);
            const currentDir = path.dirname(document.uri.fsPath);
            if (!isTrigger(currentLine, position)) {
                return Promise.resolve([]);
            }
            const words = getWords(currentLine, position);
            if (words === "" || words.indexOf(".") === -1) {
                return Promise.resolve([]);
            }
            const [obj, field] = words.split(".");
            const importModule = path_1.findImportModule(document.getText(), obj);
            const importPath = yield path_1.resolveImportPath(importModule, currentDir, yield path_alias_1.getRealPathAlias(this.pathAliasOptions, document));
            if (importPath === "") {
                return Promise.resolve([]);
            }
            const classNames = yield utils_1.getAllClassNames(importPath, field);
            return Promise.resolve(classNames.map((_class) => {
                let name = _class;
                if (this._classTransformer) {
                    name = this._classTransformer(name);
                }
                if (utils_1.isKebabCaseClassName(name)) {
                    return utils_1.createBracketCompletionItem(name, position);
                }
                return new vscode_1.CompletionItem(name, vscode_1.CompletionItemKind.Variable);
            }));
        });
    }
}
exports.CSSModuleCompletionProvider = CSSModuleCompletionProvider;
exports.default = CSSModuleCompletionProvider;
//# sourceMappingURL=CompletionProvider.js.map