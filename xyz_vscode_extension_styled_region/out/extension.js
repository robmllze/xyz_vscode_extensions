"use strict";
//.title
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//
// XYZ Styled Region
//
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//.title~
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
let activeEditor;
let timeout = null;
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
function activate(context) {
    console.log("[xyz-styled-region] Extension is now active!");
    setUpStyling();
    let activateCommand = vscode.commands.registerCommand("extension.activate", () => {
        vscode.window.showInformationMessage("[xyz-styled-region] Activated region styling!");
        setUpStyling();
    });
    let deactivateCommand = vscode.commands.registerCommand("extension.deactivate", () => {
        vscode.window.showInformationMessage("[xyz-styled-region]  Deactivated region styling!");
        tearDownStyling();
    });
    context.subscriptions.push(activateCommand, deactivateCommand);
}
exports.activate = activate;
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
function setUpStyling() {
    activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        triggerUpdateDecorations();
    }
    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            triggerUpdateDecorations();
        }
    });
    vscode.workspace.onDidOpenTextDocument(triggerUpdateDecorations);
    vscode.window.onDidChangeTextEditorSelection(triggerUpdateDecorations);
}
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
function triggerUpdateDecorations() {
    if (!activeEditor) {
        activeEditor = vscode.window.activeTextEditor;
    }
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(updateDecorations, 225);
}
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
let decorationTypes = {};
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
function updateDecorations() {
    if (!activeEditor)
        return;
    // Dispose of old decorations before applying new ones
    Object.values(decorationTypes).forEach(decorationArray => {
        decorationArray.forEach(decoration => decoration.dispose());
    });
    decorationTypes = {};
    const text = activeEditor.document.getText();
    const styleRegex = /(( *(\/\/[\/]?|##|#)).([\w\-]+)(:beg)?\n)([\s\S]*?)(\n( *(\3)).\4(:end|~))/g;
    let match;
    const styleConfig = vscode.workspace.getConfiguration("xyz-styled-region.styles");
    while (match = styleRegex.exec(text)) {
        const styleName = match[4];
        const styleProperties = styleConfig[styleName];
        if (!styleProperties)
            continue;
        const startPos = activeEditor.document.positionAt(match.index);
        const endPos = activeEditor.document.positionAt(match.index + match[0].length);
        const decoration = {
            range: new vscode.Range(startPos.translate(1, 0), endPos.translate(-1, 0))
        };
        const headerDecoration = {
            range: new vscode.Range(startPos, startPos.translate(0, match[0].indexOf("\n")))
        };
        const lastNewlinePos = match[0].lastIndexOf("\n");
        const footerStartPos = activeEditor.document.positionAt(match.index + lastNewlinePos + 1);
        const footerDecoration = {
            range: new vscode.Range(footerStartPos, endPos)
        };
        const currentBodyDecorationType = vscode.window.createTextEditorDecorationType(styleProperties);
        const currentHeaderFooterDecorationType = vscode.window.createTextEditorDecorationType({
            color: "#FFFFFF33" // 80% transparency
        });
        activeEditor.setDecorations(currentBodyDecorationType, [decoration]);
        activeEditor.setDecorations(currentHeaderFooterDecorationType, [headerDecoration, footerDecoration]);
        if (!decorationTypes[styleName]) {
            decorationTypes[styleName] = [];
        }
        decorationTypes[styleName].push(currentBodyDecorationType);
        decorationTypes[styleName].push(currentHeaderFooterDecorationType);
    }
}
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
function tearDownStyling() {
    if (activeEditor) {
        Object.keys(decorationTypes).forEach(key => {
            decorationTypes[key].forEach(decorationType => {
                activeEditor.setDecorations(decorationType, []);
            });
        });
    }
}
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
function deactivate() {
    tearDownStyling();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map