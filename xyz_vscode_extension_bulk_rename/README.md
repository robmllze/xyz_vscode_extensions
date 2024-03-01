# XYZ Bulk Rename

An extension that allows you to quickly bulk-rename files and folders.

## Usage Example

![Usage Example](xyz_vscode_extension_bulk_rename/example.gif)

## Installation

1. Open VS Code.
2. Go to the Extensions view by clicking on the square icon on the sidebar or pressing `Ctrl+Shift+X` on Windows or `Cmd+Shift+X` on MacOS.
3. Search for "XYZ Bulk Rename".
4. Install and reload VS Code.
5. This extension is activated by default. Disable the extension to deactivate it.

## Disclaimer

Bulk-renaming files can break your project if you're not careful. Be sure to try this extension with a dummy project before you use it with an important project. Always save your project before bulk-renaming files or folders in case you break something or the extension behaves in an unexpected way.

## Usage Instructions

1. Open a a workspace in Visual Studio Code.
2. Save your project.
3. Right-click in the Explorer view.
4. Select "[XYZ Bulk Rename] Start" from the context menu.
5. A file named ".BULK_RENAME.txt" will be created in the root of the workspace.
6. Open ".BULK_RENAME.txt", and rename the files or folders as needed (Tip: Press `Ctrl+F` (Windows/Linux) or `Cmd+F` (MacOS) to search for the files or folders if there are too many).
7. Save the file (Tip: Enable auto-save in Visual Studio Code).
8. The files and folders will be renamed accordingly and ".BULK_RENAME.txt" will update.
9. Files or folders staring with a dot "." will be ignored.

## Known Issues

- Currently no folders or files are ignored, except files of folders starting with a dot ".". So if you have a "node_modules" folder for example, all those files and folders will appear in "BULK_RENAME.txt". For now, press `Ctrl+F` (Windows/Linux) or `Cmd+F` (MacOS) to search for the files or folders if there are too many.
- There is currently no way to stop the process once started, unless you close and reopen Visual Studio Code. Luckily it's not really disruptive.

## License

This extension is licensed under the [MIT License](LICENSE).

## All Extensions by XYZ

- [XYZ .hideme](https://marketplace.visualstudio.com/items?itemName=robmllze.xyz-hideme): An extension that allows you to easily hide files and folders that are listed in your project's `.hideme` file.
- [XYZ Styled Region](https://marketplace.visualstudio.com/items?itemName=robmllze.xyz-styled-region): An extension that allows you to apply custom styles to marked regions in your code. Enhance your coding experience with visually appealing regions, making it easier to read, debug, and navigate your code.
- [XYZ Bulk Rename](https://marketplace.visualstudio.com/items?itemName=robmllze.xyz-bulk-rename): An extension that allows you to quickly bulk-rename files and folders
- [XYZ Run Script](https://marketplace.visualstudio.com/items?itemName=robmllze.xyz-run-script): An extension that allows you to run scripts via right-click.

<img src="xyz_vscode_extension_bulk_rename/icon.png" alt="Alt text" width="72px" height="72px"/>
