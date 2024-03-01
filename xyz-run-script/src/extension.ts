//.title
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//
// XYZ Visual Studio Code Extensions
//
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//.title~

import * as vscode from 'vscode';
import * as path from 'path';

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand("extension.runScript", (uri: vscode.Uri) => {
		const scriptPath = uri.fsPath;
		const scriptExtension = path.extname(scriptPath).toLowerCase();
		const commandsMap = vscode.workspace.getConfiguration().get<{ [key: string]: string }>("xyz-run-script.commands");

		if (commandsMap && commandsMap[scriptExtension]) {
			const command = `${commandsMap[scriptExtension]} ${scriptPath}`;

			// Get or create a terminal to run the script.
			const terminal = vscode.window.terminals.find(t => t.name === "Script Output") || vscode.window.createTerminal("Script Output");
			terminal.show();

			// Use terminal to execute the command.
			terminal.sendText(command, true);
		} else {
			vscode.window.showWarningMessage(`No command found for ${scriptExtension} files. Please configure it in settings.`);
		}
	});

	context.subscriptions.push(disposable);
}

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

export function deactivate() { }
