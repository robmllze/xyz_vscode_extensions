//
// Package by Robert Mollentze - robmllze@gmail.com
//

const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

//
//
//

// Define function for bulk renaming of files and folders
async function bulkRename() {

	// Get workspace folders and check if there are any
	const folders = vscode.workspace.workspaceFolders;
	if (!folders) {
		vscode.window.showInformationMessage('No workspace folders found');
		return;
	}

	var {
		fileList,
		foldersList
	} = await getAllFilesAndFolders(folders[0].uri.fsPath);

	// Generate content for BULK_RENAME.txt file, create the file and open it in the editor
	const content = `Files:\n${fileList.join('\n')}\n\nFolders:\n${foldersList.join('\n')}`;
	const fileName = '.BULK_RENAME.txt';
	const filePath = path.join(folders[0].uri.fsPath, fileName);
	const fileUri = vscode.Uri.file(filePath);

	try {
		await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content));
		const document = await vscode.workspace.openTextDocument(fileUri);

		// Set up a listener for saving the BULK_RENAME.txt file
		vscode.workspace.onDidSaveTextDocument(event => {
			// If the saved file is the BULK_RENAME.txt file, get updated
			// content and update file and folder names accordingly
			if (event.uri.toString() === fileUri.toString()) {
				const updatedContent = fs.readFileSync(filePath, 'utf-8');
				const newFoldersList = updatedContent.split('\n\nFolders:\n')[1].split('\n');
				for (let i = 0; i < foldersList.length; i++) {
					const oldFolder = foldersList[i];
					const newFolder = newFoldersList[i];
					if (oldFolder !== newFolder) {
						fs.renameSync(oldFolder, newFolder);
					}
				}
				foldersList = newFoldersList;
				const newFiles = updatedContent.split('\n\nFolders:\n')[0].split('\n').slice(1);
				for (let i = 0; i < fileList.length; i++) {
					const oldFile = fileList[i];
					const newFile = newFiles[i];
					if (oldFile !== newFile) {
						fs.renameSync(oldFile, newFile);
					}
				}
				fileList = newFiles;
			}
		});

	} catch (e) {
		vscode.window.showErrorMessage(`[xyz-bulk-rename] Error: ${e}`);
	}
}

//
//
//

function activate(context) {
	// Register the 'xyz-bulk-rename.start' command
	let disposable = vscode.commands.registerCommand('xyz-bulk-rename.start', async function () {
		bulkRename();
	});
	context.subscriptions.push(disposable);

	// Register the onDidChangeWorkspaceFolders event
	const disposable2 = vscode.workspace.onDidChangeWorkspaceFolders(() => {
		bulkRename();
	});

	context.subscriptions.push(disposable2);

	// Register the onDidCreateFiles event
	const disposable3 = vscode.workspace.onDidCreateFiles((event) => {
		console.log(`[xyz-bulk-rename] File/Folder(s) created: ${event.files}`);
		bulkRename();
	});

	context.subscriptions.push(disposable3);

	// Register the onDidDeleteFiles event
	const disposable4 = vscode.workspace.onDidDeleteFiles((event) => {
		console.log(`[xyz-bulk-rename] File/Folder(s) deleted: ${event.files}`);
		bulkRename();
	});

	context.subscriptions.push(disposable4);

	// Register the onDidRenameFiles event
	const disposable5 = vscode.workspace.onDidRenameFiles((event) => {
		console.log(`[xyz-bulk-rename] File/Folder(s) renamed: ${event.files}`);
		bulkRename();
	});

	context.subscriptions.push(disposable5);
}

//
//
//

// Recursively gets all files and folders in a given folder path
// and filters out files and folders starting with a dot.
async function getAllFilesAndFolders(folderPath) {
	const entries = await fs.promises.readdir(folderPath, {
		withFileTypes: true
	});
	const fileList = [];
	const foldersList = [];
	for (const entry of entries) {
		const name = entry.name;
		if (name.startsWith('.')) continue;
		const fullPath = path.join(folderPath, name);
		if (entry.isFile()) {
			fileList.push(fullPath);
		} else if (entry.isDirectory() && name) {
			foldersList.push(fullPath);
			const subEntries = await getAllFilesAndFolders(fullPath);
			fileList.push(...subEntries.fileList);
			foldersList.push(...subEntries.foldersList);
		}
	}
	return {
		fileList,
		foldersList
	};
}

module.exports = { activate };