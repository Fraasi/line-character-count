"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });

const {window, StatusBarAlignment, Disposable} = require("vscode");

function activate(context) {
    console.log('LineCount/CharacterCount is initialized');
    let counter = new Counter();
    let controller = new CounterController(counter);
    context.subscriptions.push(counter);
}

exports.activate = activate;

class Counter {
    updateLineCount() {
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);
        }
        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        let doc = editor.document;
		let counts = this._getCounts(doc);
		this._statusBarItem.text = `( ${counts} )`
		this._statusBarItem.tooltip = 'LineCount / CharacterCount';
        this._statusBarItem.show();
    }
	_getCounts(doc) {
		let docContent = doc.getText();
        let lineCount = 0;
		let characterCount = 0;
        if (docContent != "") {
			characterCount = docContent.replace(/[\r\n\s]+/g, '').length;
            lineCount = docContent.split(/\r?\n/g).length;
		}
		return `${lineCount} / ${characterCount}`;
	}
    dispose() {
        this._statusBarItem.dispose();
    }
}
class CounterController {
    constructor(Counter) {
        this._Counter = Counter;
        // subscribe to selection change and editor activation events
        let subscriptions = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
      
        this._Counter.updateLineCount();
        // create a combined disposable from both event subscriptions?
        this._disposable = Disposable.from(...subscriptions);
    }
    dispose() {
        this._disposable.dispose();
    }
    _onEvent() {
        this._Counter.updateLineCount();
    }
}
//# sourceMappingURL=extension.js.map