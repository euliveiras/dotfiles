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
var _DenoServerInfo_fullVersion;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DenoServerInfo = void 0;
class DenoServerInfo {
    constructor(serverInfo) {
        var _a;
        _DenoServerInfo_fullVersion.set(this, void 0);
        __classPrivateFieldSet(this, _DenoServerInfo_fullVersion, (_a = serverInfo === null || serverInfo === void 0 ? void 0 : serverInfo.version) !== null && _a !== void 0 ? _a : "", "f");
    }
    /** Gets the version with configuration and architecture. Ex: x.x.x (release, x86_64-etc) */
    get versionWithBuildInfo() {
        return __classPrivateFieldGet(this, _DenoServerInfo_fullVersion, "f");
    }
    /** Gets the version. Ex. x.x.x */
    get version() {
        return __classPrivateFieldGet(this, _DenoServerInfo_fullVersion, "f").split(" ")[0];
    }
}
exports.DenoServerInfo = DenoServerInfo;
_DenoServerInfo_fullVersion = new WeakMap();
//# sourceMappingURL=server_info.js.map