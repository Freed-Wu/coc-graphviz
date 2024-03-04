# dot-vscode

Ported from [dot-vscode](https://github.com/nikeee/dot-vscode).

Because some APIs of [vscode](github.com/microsoft/vscode) are missing in
[coc.nvim](https://github.com/neoclide/coc.nvim), disable some features
temporarily:

- when selection change, provider will not update: miss `vscode.window.onDidChangeTextEditorSelection`
- command `graphviz.previewToSide`: miss `vscode.ViewColumn`
- command `graphviz.preview`: miss command `vscode.previewHtml`. VS Code has
  deprecated it by webview API which is supported by
  [coc-webview](https://github.com/weirongxu/coc-webview). Refer
  <https://github.com/nikeee/dot-vscode/issues/9>.

## Install

- [coc-marketplace](https://github.com/fannheyward/coc-marketplace)
- [npm](https://www.npmjs.com/package/coc-graphviz)
- vim:

```vim
" command line
CocInstall coc-graphviz
" or add the following code to your vimrc
let g:coc_global_extensions = ['coc-graphviz', 'other coc-plugins']
```

---

## Installation
1. Install the dot-language-server: `npm i -g dot-language-server`
2. Install this Extension

*Want to add a language support feature?* Head over to the repository of [`dot-language-support`](https://github.com/nikeee/dot-language-support).

*Think this addon is cool?* There is also a web version of it. Head over to [edotor.net](https://edotor.net) (or its [GitHub repo](https://github.com/nikeee/edotor.net)).

## Credits
This Visual Studio Code extension is based on the work of [joaompinto/vscode-graphviz](https://github.com/joaompinto/vscode-graphviz) and [Stephanvs/vscode-graphviz](https://github.com/Stephanvs/vscode-graphviz), both MIT licensed. Thank you!
