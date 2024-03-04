import {resolve} from 'path';
import {
	window,
	workspace,
	services,
	ExtensionContext,
	// Disposable,
	DidChangeTextDocumentParams,
	// ViewColumn,
	TextDocument,
	TransportKind,
	// TextEditorSelectionChangeEvent,
	commands
} from "coc.nvim";

import {
	ServerOptions,
	LanguageClient,
	LanguageClientOptions,
} from "coc.nvim";

import * as gvp from "./GraphvizProvider";

export function activate(context: ExtensionContext) {
	let serverModule = resolve(context.extensionPath, 'out', 'src', 'server')
	const lc = createLanguageClient(serverModule);
	const lcDisposable = services.registLanguageClient(lc);

	const gvProviders = createGraphvizProviders();

	context.subscriptions.push(lcDisposable, ...gvProviders);
}

function createLanguageClient(serverModule: string) {
	const serverOptions: ServerOptions = {
		run : {
			module: serverModule,
			transport: TransportKind.ipc,
		},
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: {
				execArgv: [
					"--nolazy",
					"--debug=6009"
				]
			}
		},

		// Type assertion because of unreleased patch
		// https://github.com/Microsoft/vscode-languageserver-node/issues/358
		options: { shell: true } as any
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ language: "dot" }],
		synchronize: {
			configurationSection: "dotLanguageServer",
			// Notify the server about file changes to '.clientrc files contain in the workspace
			fileEvents: workspace.createFileSystemWatcher("**/.clientrc")
		}
	};

	return new LanguageClient(
		"dotLanguageServer",
		"DOT Language Server",
		serverOptions,
		clientOptions,
	);
}

/**
 * Based on https://github.com/joaompinto/vscode-graphviz
 */
function createGraphvizProviders() {
	const provider = new gvp.GraphvizProvider();
	const providerRegistrations = /* Disposable.from( */
		workspace.registerTextDocumentContentProvider(
			gvp.GraphvizProvider.scheme,
			provider
		)
	/* ) */;

	// When the active document is changed set the provider for rebuild
	// this only occurs after an edit in a document
	workspace.onDidChangeTextDocument((e: DidChangeTextDocumentParams) => {
		if (e.textDocument === window.activeTextEditor.document.textDocument) {
			provider.setNeedsRebuild(true);
		}
	});

	// This occurs whenever the selected document changes, its useful to keep the
	// window.onDidChangeTextEditorSelection(
	// 	(e: TextEditorSelectionChangeEvent) => {
	// 		if (
	// 			!!e &&
	// 			!!e.textEditor &&
	// 			e.textEditor === window.activeTextEditor
	// 		) {
	// 			provider.setNeedsRebuild(true);
	// 		}
	// 	}
	// );

	workspace.onDidSaveTextDocument((e: TextDocument) => {
		if (e === window.activeTextEditor.document.textDocument) {
			provider.update(gvp.makePreviewUri(e));
		}
	});

	// const previewToSide = commands.registerCommand(
	// 	"graphviz.previewToSide",
	// 	() => {
	// 		const displayColumn = getDisplayColumn(
	// 			window.activeTextEditor.viewColumn
	// 		);
	// 		return gvp.createHTMLWindow(provider, displayColumn);
	// 	}
	// );

	const preview = commands.registerCommand("graphviz.preview", () => {
		return gvp.createHTMLWindow(
			provider,
			// window.activeTextEditor.viewColumn
		);
	});

	return [/* previewToSide, */ preview, providerRegistrations];
}

// function getDisplayColumn(viewColumn: ViewColumn) {
// 	switch (viewColumn) {
// 		case ViewColumn.One:
// 			return ViewColumn.Two;
// 		case ViewColumn.Two:
// 		case ViewColumn.Three:
// 			return ViewColumn.Three;
// 	}
// }
