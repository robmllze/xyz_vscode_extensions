//.title
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//
// XYZ Visual Studio Code Extensions
//
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//.title~

import * as vscode from 'vscode';

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

class TaskTreeItem extends vscode.TreeItem {
	constructor(public readonly task: vscode.Task) {
		super(task.name, vscode.TreeItemCollapsibleState.None);
		this.command = {
			title: "Run Task",
			command: "extension.runTask",
			arguments: [task]
		};
	}
}

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

class TaskProvider implements vscode.TreeDataProvider<TaskTreeItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<TaskTreeItem | undefined> = new vscode.EventEmitter<TaskTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<TaskTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(private tasks: vscode.Task[]) { }

	refresh(): void {
		vscode.tasks.fetchTasks().then((tasks) => {
			this.tasks = tasks.filter(task => task.source === "Workspace");
			this._onDidChangeTreeData.fire(undefined);
		});
	}

	getTreeItem(element: TaskTreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: TaskTreeItem): Thenable<TaskTreeItem[]> {
		if (element) {
			return Promise.resolve([]);
		}
		return Promise.resolve(this.tasks.map(task => new TaskTreeItem(task)));
	}
}

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

export function activate(context: vscode.ExtensionContext) {
	const taskProvider = new TaskProvider([]);
	vscode.window.registerTreeDataProvider('tasksView', taskProvider);

	context.subscriptions.push(vscode.commands.registerCommand('extension.runTask', (task: vscode.Task) => {
		vscode.tasks.executeTask(task);
	}));

	// Register command to manually refresh tasks.
	context.subscriptions.push(vscode.commands.registerCommand('extension.refreshTasks', () => {
		taskProvider.refresh();
	}));

	// Automatically refresh tasks when tasks.json changes.
	const tasksJsonWatcher = vscode.workspace.createFileSystemWatcher('**/.vscode/tasks.json');
	tasksJsonWatcher.onDidChange(() => taskProvider.refresh());
	tasksJsonWatcher.onDidCreate(() => taskProvider.refresh());
	tasksJsonWatcher.onDidDelete(() => taskProvider.refresh());
	context.subscriptions.push(tasksJsonWatcher);

	// Initial fetch of tasks.
	taskProvider.refresh();
}

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

export function deactivate() { }
