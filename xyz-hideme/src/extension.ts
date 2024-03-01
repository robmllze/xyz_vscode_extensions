//.title
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//
// XYZ Visual Studio Code Extensions
//
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//.title~

import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

function readHideList(workspacePath: string): string[] {
	try {
		const hideListFiles = listFilesWithHidemeExtension(workspacePath);
		const allLines: string[] = [];

		hideListFiles.forEach((filePath) => {
			try {
				let fileDir = convertToMacOSPath(path.dirname(filePath));
				fileDir.startsWith(workspacePath) ? fileDir = fileDir.substring(workspacePath.length) : null;
				fileDir.startsWith("/") ? fileDir = fileDir.substring(1) : null;
				const fileContent = fs.readFileSync(filePath, "utf8");
				const lines = fileContent.split("\n").map(line => {
					const relativePath = line.trim();
					if (relativePath.length !== 0) {
						const dirPath = convertToMacOSPath(path.join(fileDir, relativePath));
						return dirPath;
					}
					return '';
				}).filter(line => line !== '');
				allLines.push(...lines);
			} catch (error) {
				console.error(`[xyz_hideme] Error reading .hideme file: ${error}`);
			}
		});

		return allLines.filter((entry) => entry !== "");
	} catch (error) {
		console.error(`[xyz_hideme] Error reading .hideme file: ${error}`);
		return [];
	}
}


// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

function listFilesWithHidemeExtension(workspacePath: string): string[] {
	try {
		const allFiles = listFilesAndFoldersRecursively(workspacePath);
		const hidemeFiles = allFiles.filter((filePath) => {
			const fileName = path.basename(filePath).toLocaleLowerCase();
			const isHideMe = fileName.startsWith(".hideme") || fileName.endsWith(".hideme");
			return isHideMe;
		});

		return hidemeFiles;
	} catch (error) {
		console.error(`[xyz_hideme] Error listing files with .hideme extension: ${error}`);
		return [];
	}
}


// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░


// Function to list files and folders recursively
function listFilesAndFoldersRecursively(folderPath: string, result: string[] = []): string[] {
	const filesAndFolders = fs.readdirSync(folderPath);

	filesAndFolders.forEach((item) => {
		const itemPath = path.join(folderPath, item);

		if (fs.statSync(itemPath).isDirectory()) {
			// If it's a directory, recursively call the function and add the directory itself to the result
			result.push(itemPath, ...listFilesAndFoldersRecursively(itemPath));
		} else {
			// If it's a file, add it to the result
			result.push(itemPath);
		}
	});

	return result;
}

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

// Function to hide files and folders based on patterns
function hideFilesAndFolders(hideList: string[]) {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		return;
	}

	workspaceFolders.forEach((folder) => {
		const config = vscode.workspace.getConfiguration("files", folder.uri);
		const updatedExcludes: Record<string, boolean> = {};

		hideList.forEach((hideStr) => {
			listFilesAndFoldersRecursively(folder.uri.fsPath).forEach((item) => {
				//const relativePath = path.relative(folder.uri.fsPath, item);
				//if (doesMatch(hideStr, relativePath)) {
				updatedExcludes[hideStr] = true;
				//}
			});
		});

		//config.update("exclude", undefined, vscode.ConfigurationTarget.Workspace);
		config.update("exclude", updatedExcludes, vscode.ConfigurationTarget.Workspace);
	});
}

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

function convertToMacOSPath(inputPath: string) {
	// Replace backslashes with forward slashes
	const macosPath = inputPath.replace(/\\/g, '/');

	return macosPath;
}

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

function doesMatch(hideStr: string, item: string): boolean {
	// Convert the hideStr pattern to a regular expression
	const regexPattern = hideStr
		.replace(/\\/g, '\\\\') // Escape backslashes
		.replace(/\./g, '\\.') // Escape periods
		.replace(/\*/g, '.*'); // Replace asterisks with .* for matching any characters

	const regex = new RegExp(`^${regexPattern}$`);

	// Check if the item matches the regular expression
	return regex.test(item);
}

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

// Register a command to toggle indentation for the current file when Ctrl+H+1 is pressed and the file starts or ends with .hideme
const disposable = vscode.commands.registerTextEditorCommand("extension.toggleCurrentFile", (textEditor) => {
	const activeFile = textEditor.document.fileName.toLocaleLowerCase();
	if (activeFile.startsWith(".hideme") || activeFile.endsWith(".hideme")) {
		textEditor.edit((editBuilder) => {
			const document = textEditor.document;
			const selection = textEditor.selection;

			if (selection.isEmpty) {
				// If no text is selected, toggle indentation for the entire document
				const text = document.getText();
				const toggledText = toggleIndentation(text);
				editBuilder.replace(
					new vscode.Range(
						document.positionAt(0),
						document.positionAt(text.length)
					),
					toggledText
				);
			} else {
				// If text is selected, toggle indentation only for the selected lines
				const selectedText = document.getText(selection);
				const toggledText = toggleIndentation(selectedText);
				editBuilder.replace(selection, toggledText);
			}
		});

	} else {
		vscode.window.showInformationMessage("[xyz_hideme] Current file does not start or end with .hideme.");
	}
});

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

function toggleIndentation(text: string): string {
	const off = "[OFF] ";
	const lines = text.split("\n");
	const indentedLines = lines.map((line) => {
		if (line.startsWith(off)) {
			// Remove leading four spaces
			return line.substring(off.length);
		} else {
			// Prepend four spaces
			return off + line;
		}
	});
	return indentedLines.join("\n");
}

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

export function activate(context: vscode.ExtensionContext) {
	console.log("[xyz_hideme] Extension is now active.");

	const disposables: vscode.Disposable[] = [];

	// Monitor changes to the .hideme files and update configuration.
	vscode.workspace.onDidChangeTextDocument((e) => {
		const fileName = path.basename(e.document.fileName).toLocaleLowerCase();
		if (fileName.startsWith(".hideme") || fileName.endsWith(".hideme")) {
			const workspaceFolder = vscode.workspace.getWorkspaceFolder(e.document.uri);
			if (workspaceFolder) {
				const workspacePath = workspaceFolder.uri.fsPath;
				hideFilesAndFolders(readHideList(workspacePath));
			}
		}
	});

	context.subscriptions.push(...disposables);
}



// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

export function deactivate() {
	console.log("[xyz_hideme] Extension is now deactivated.");
}