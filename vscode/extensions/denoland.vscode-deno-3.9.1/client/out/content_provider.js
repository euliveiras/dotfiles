"use strict";
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DenoTextDocumentContentProvider = exports.SCHEME = void 0;
const lsp_extensions_1 = require("./lsp_extensions");
exports.SCHEME = "deno";
class DenoTextDocumentContentProvider {
    constructor(extensionContext) {
        this.extensionContext = extensionContext;
    }
    provideTextDocumentContent(uri, token) {
        if (!this.extensionContext.client) {
            throw new Error("Deno language server has not started.");
        }
        return this.extensionContext.client.sendRequest(lsp_extensions_1.virtualTextDocument, { textDocument: { uri: uri.toString() } }, token);
    }
}
exports.DenoTextDocumentContentProvider = DenoTextDocumentContentProvider;
//# sourceMappingURL=content_provider.js.map