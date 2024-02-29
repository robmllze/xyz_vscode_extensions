"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
function activate(context) {
    let disposable = vscode.commands.registerCommand("extension.runScript", (uri) => {
        const scriptPath = uri.fsPath;
        const scriptExtension = path.extname(scriptPath).toLowerCase();
        const commandsMap = vscode.workspace.getConfiguration().get("xyz-run-script.commands");
        if (commandsMap && commandsMap[scriptExtension]) {
            const command = `${commandsMap[scriptExtension]} ${scriptPath}`;
            // Get or create a terminal to run the script
            const terminal = vscode.window.terminals.find(t => t.name === "Script Output") || vscode.window.createTerminal("Script Output");
            terminal.show();
            // Use terminal to execute the command
            terminal.sendText(command, true);
        }
        else {
            vscode.window.showWarningMessage(`No command found for ${scriptExtension} files. Please configure it in settings.`);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map