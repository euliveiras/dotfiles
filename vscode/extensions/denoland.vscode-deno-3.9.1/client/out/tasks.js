"use strict";
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateTaskProvider = exports.buildDenoTask = exports.TASK_SOURCE = exports.TASK_TYPE = void 0;
const util_1 = require("./util");
const vscode = require("vscode");
exports.TASK_TYPE = "deno";
exports.TASK_SOURCE = "deno";
async function buildDenoTask(target, definition, name, args, problemMatchers) {
    const exec = new vscode.ProcessExecution(await (0, util_1.getDenoCommand)(), args, definition);
    return new vscode.Task(definition, target, name, exports.TASK_SOURCE, exec, problemMatchers);
}
exports.buildDenoTask = buildDenoTask;
function isWorkspaceFolder(value) {
    return typeof value === "object" && value != null &&
        value.name !== undefined;
}
class DenoTaskProvider {
    async provideTasks() {
        var _a;
        const defs = [
            {
                command: "bundle",
                group: vscode.TaskGroup.Build,
                problemMatchers: ["$deno"],
            },
            {
                command: "cache",
                group: vscode.TaskGroup.Build,
                problemMatchers: ["$deno"],
            },
            {
                command: "compile",
                group: vscode.TaskGroup.Build,
                problemMatchers: ["$deno"],
            },
            {
                command: "lint",
                group: vscode.TaskGroup.Test,
                problemMatchers: ["$deno-lint"],
            },
            { command: "run", group: undefined, problemMatchers: ["$deno"] },
            {
                command: "test",
                group: vscode.TaskGroup.Test,
                problemMatchers: ["$deno-test"],
            },
        ];
        const tasks = [];
        for (const workspaceFolder of (_a = vscode.workspace.workspaceFolders) !== null && _a !== void 0 ? _a : []) {
            for (const { command, group, problemMatchers } of defs) {
                const task = await buildDenoTask(workspaceFolder, { type: exports.TASK_TYPE, command }, command, [command], problemMatchers);
                task.group = group;
                tasks.push(task);
            }
        }
        return tasks;
    }
    async resolveTask(task) {
        var _a;
        const definition = task.definition;
        if (definition.type === exports.TASK_TYPE && definition.command) {
            const args = [definition.command].concat((_a = definition.args) !== null && _a !== void 0 ? _a : []);
            if (isWorkspaceFolder(task.scope)) {
                return await buildDenoTask(task.scope, definition, task.name, args, task.problemMatchers);
            }
        }
    }
}
function activateTaskProvider() {
    const provider = new DenoTaskProvider();
    return vscode.tasks.registerTaskProvider(exports.TASK_TYPE, provider);
}
exports.activateTaskProvider = activateTaskProvider;
//# sourceMappingURL=tasks.js.map