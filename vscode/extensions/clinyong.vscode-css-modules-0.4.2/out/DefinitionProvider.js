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
exports.CSSModuleDefinitionProvider = void 0;
const vscode_1 = require("vscode");
const utils_1 = require("./utils");
const path_1 = require("./utils/path");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const path_alias_1 = require("./path-alias");
function getWords(line, position) {
    const headText = line.slice(0, position.character);
    const startIndex = headText.search(/[a-zA-Z0-9._]*$/);
    // not found or not clicking object field
    if (startIndex === -1 || headText.slice(startIndex).indexOf(".") === -1) {
        return "";
    }
    const match = /^([a-zA-Z0-9._]*)/.exec(line.slice(startIndex));
    if (match === null) {
        return "";
    }
    return match[1];
}
function getTransformer(camelCaseConfig) {
    switch (camelCaseConfig) {
        case true:
            return _.camelCase;
        case "dashes":
            return utils_1.dashesCamelCase;
        default:
            return null;
    }
}
function getPosition(filePath, className, camelCaseConfig) {
    const content = fs.readFileSync(filePath, { encoding: "utf8" });
    const lines = content.split("\n");
    let lineNumber = -1;
    let character = -1;
    let keyWord = className;
    const classTransformer = getTransformer(camelCaseConfig);
    if (camelCaseConfig !== true) {
        // is false or 'dashes'
        keyWord = `.${className}`;
    }
    /**
     * This is a simple solution for definition match.
     * Only guarantee keyword not follow normal characters
     *
     * if we want match [.main] classname
     * escaped dot char first and then use RegExp to match
     * more detail -> https://github.com/clinyong/vscode-css-modules/pull/41#discussion_r696247941
     *
     * 1. .main,   // valid
     * 2. .main    // valid
     *
     * 3. .main-sub   // invalid
     * 4. .main09     // invalid
     * 5. .main_bem   // invalid
     * 6. .mainsuffix // invalid
     *
     * @TODO Refact by new tokenizer later
     */
    const keyWordMatchReg = new RegExp(`${keyWord.replace(/^\./, '\\.')}(?![_0-9a-zA-Z-])`);
    for (let i = 0; i < lines.length; i++) {
        const originalLine = lines[i];
        /**
         * The only way to guarantee that a position will be returned for a camelized class
         * is to check after camelizing the source line.
         * Doing the opposite -- uncamelizing the used classname -- would not always give
         * correct result, as camelization is lossy.
         * i.e. `.button--disabled`, `.button-disabled` both give same
         * final class: `css.buttonDisabled`, and going back from this to that is not possble.
         *
         * But this has a drawback - camelization of a line may change the final
         * positions of classes. But as of now, I don't see a better way, and getting this
         * working is more important, also putting this functionality out there would help
         * get more eyeballs and hopefully a better way.
         */
        const line = !classTransformer
            ? originalLine
            : classTransformer(originalLine);
        /**
         * @isMatchChar for match check
         * @character for position
         */
        let isMatchChar = keyWordMatchReg.test(line);
        character = line.indexOf(keyWord);
        if (!isMatchChar && !!classTransformer) {
            // if camelized match fails, and transformer is there
            // try matching the un-camelized classnames too!
            character = originalLine.indexOf(keyWord);
            isMatchChar = keyWordMatchReg.test(originalLine);
        }
        if (isMatchChar) {
            lineNumber = i;
            break;
        }
    }
    if (lineNumber === -1) {
        return null;
    }
    else {
        return new vscode_1.Position(lineNumber, character + 1);
    }
}
function isImportLineMatch(line, matches, current) {
    if (matches === null) {
        return false;
    }
    const start1 = line.indexOf(matches[1]) + 1;
    const start2 = line.indexOf(matches[2]) + 1;
    // check current character is between match words
    return ((current > start2 && current < start2 + matches[2].length) ||
        (current > start1 && current < start1 + matches[1].length));
}
function getKeyword(currentLine, position) {
    const words = getWords(currentLine, position);
    if (words === "" || words.indexOf(".") === -1) {
        return null;
    }
    const [obj, field] = words.split(".");
    if (!obj || !field) {
        // probably a spread operator
        return null;
    }
    return { obj, field };
}
function getClickInfoByKeyword(document, currentLine, position) {
    const keyword = getKeyword(currentLine, position);
    if (!keyword) {
        return null;
    }
    const importModule = path_1.findImportModule(document.getText(), keyword.obj);
    const targetClass = keyword.field;
    return {
        importModule,
        targetClass,
    };
}
function getClickInfo(document, currentLine, position) {
    const matches = path_1.genImportRegExp("(\\S+)").exec(currentLine);
    if (isImportLineMatch(currentLine, matches, position.character)) {
        return {
            importModule: matches[2],
            targetClass: "",
        };
    }
    return getClickInfoByKeyword(document, currentLine, position);
}
class CSSModuleDefinitionProvider {
    constructor(options) {
        this._camelCaseConfig = false;
        this._camelCaseConfig = options.camelCase;
        this.pathAliasOptions = options.pathAlias;
    }
    provideDefinition(document, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDir = path.dirname(document.uri.fsPath);
            const currentLine = utils_1.getCurrentLine(document, position);
            const clickInfo = getClickInfo(document, currentLine, position);
            if (!clickInfo) {
                return Promise.resolve(null);
            }
            const importPath = yield path_1.resolveImportPath(clickInfo.importModule, currentDir, yield path_alias_1.getRealPathAlias(this.pathAliasOptions, document));
            if (importPath === "") {
                return Promise.resolve(null);
            }
            let targetPosition = null;
            if (clickInfo.targetClass) {
                targetPosition = getPosition(importPath, clickInfo.targetClass, this._camelCaseConfig);
            }
            else {
                targetPosition = new vscode_1.Position(0, 0);
            }
            if (targetPosition === null) {
                return Promise.resolve(null);
            }
            else {
                return Promise.resolve(new vscode_1.Location(vscode_1.Uri.file(importPath), targetPosition));
            }
        });
    }
}
exports.CSSModuleDefinitionProvider = CSSModuleDefinitionProvider;
exports.default = CSSModuleDefinitionProvider;
//# sourceMappingURL=DefinitionProvider.js.map