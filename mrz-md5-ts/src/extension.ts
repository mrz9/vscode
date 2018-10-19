// 'vscode'模块包括VS Code插件API
// 导入下面代码使用的必备的插件类型
const crypto = require('crypto');
const fs = require('fs');
import * as vscode from 'vscode';

// 这个函数将在你的插件被激活时被调用，激活是由定义在
// package.json文件中的activation events定义的
export function activate(context: vscode.ExtensionContext) {

    // 创建一个新的单词数统计对象
    let md5Counter = new Md5Counter();
    md5Counter.updateMd5();

    vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
		md5Counter.updateMd5();
	});

    // 添加到当插件关闭时被清理的可清理列表
    context.subscriptions.push(md5Counter);
}

class Md5Counter{
    updateMd5(){
        // 创建所需的状态栏元素
        if (!this._statusBarItem) {
            this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        }

        // 得到当前的文本编辑器
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;

        // 只有当是Markdown文件的时候才更新状态
        if (doc.languageId === "css" || doc.languageId === 'javascript') {
            // 更新状态栏
            this._statusBarItem.text = Util.md5(doc.fileName);
            this._statusBarItem.show();
        } else { 
            this._statusBarItem.hide();
        }
    }
    dispose(){
        this._statusBarItem.dispose();
    }
}

const Util = {
    md5:(path:String)=>{
        let content = fs.readFileSync(path);
        let md5 = crypto.createHash('md5').update(content).digest('hex');
        return md5
    }
}
