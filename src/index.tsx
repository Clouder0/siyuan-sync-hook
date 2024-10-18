/* import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css'; */
import { PluginContext } from "@/lib/context";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { render } from "preact";
import { Menu, Plugin, Setting, showMessage } from "siyuan";

const theme = createTheme({
	colorSchemes: {
		dark: true,
	},
});

import MySettings from "@/setting";
import { config_data_schema, getConfig } from "./lib/config";
import { run_hook } from "./lib/hook";

const STORAGE_NAME = "SyncHook";

export default class PluginSample extends Plugin {
	plugin_context = {} as PluginContext;

	onLayoutReady(): void {
		this.loadData(STORAGE_NAME).then((x) => {
			this.plugin_context.config = getConfig(x);
		});
		this.plugin_context;
	}

	async onload() {
		const load_context = this.plugin_context;
		if (!load_context.config) {
			const conf = getConfig(await this.loadData(STORAGE_NAME));
			load_context.config = conf;
		}

		this.addTopBar({
			icon: "iconEmoji",
			title: "Test Solidjs",
			callback: () => {
				// this.showHelloDialog();
			},
		});
		this.setting = new Setting({
			confirmCallback: () => {
				console.log("setting confirmed.");
				// read from data
				const new_data = load_context.config_writer!.data;
				console.log(new_data);
				const parsed = config_data_schema.parse(new_data);
				this.saveData(STORAGE_NAME, parsed);
				// commit to current context
				load_context.config = getConfig(parsed);
				console.log("context updated", load_context);
			},
			destroyCallback: () => {
				// destroy writer
				load_context.config_writer = undefined;
				console.log("context writer destroyed");
			},
		});
		this.setting.addItem({
			title: "Hooks",
			direction: "row",
			description: "all hooks you defined",
			createActionElement: () => {
				// set context in first element creation
				console.log("Create action element", load_context);
				const writer = load_context.config!.getWriter();
				load_context.config_writer = writer;

				const StateWrapper = ({ ctx }: { ctx: PluginContext }) => {
					console.log("Render State Wrapper with context", ctx);
					return (
						<ThemeProvider theme={theme}>
							<PluginContext.Provider value={ctx}>
								<MySettings />
							</PluginContext.Provider>
						</ThemeProvider>
					);
				};
				const e = document.createElement("div");
				render(<StateWrapper ctx={load_context} />, e);
				return e;
			},
		});

		const topBarElement = this.addTopBar({
			icon: "iconFace",
			title: "SyncHook",
			position: "right",
			callback: () => {
				let rect = topBarElement.getBoundingClientRect();
				// 如果被隐藏，则使用更多按钮
				if (rect.width === 0) {
					rect = document.querySelector("#barMore")!.getBoundingClientRect();
				}
				if (rect.width === 0) {
					rect = document.querySelector("#barPlugins")!.getBoundingClientRect();
				}
				this.addMenu(rect);
			},
		});
	}
	private addMenu(rect?: DOMRect) {
		const menu = new Menu("SyncHookMenu", () => {});
		menu.addItem({
			icon: "iconSelect",
			label: "Manual Sync",
			type: "submenu",
			submenu: this.plugin_context.config!.data.hooks.map((hook) => ({
				icon: "iconScrollHoriz",
				label: `Sync ${hook.name}`,
				click: () => {
					console.log("Trigger Sync", hook);
					showMessage(`Starting to run Hook ${hook.name}...`);
					run_hook(hook)
						.then((res) => {
							if (!res || res.status === "0") {
								showMessage(
									`Hook ${hook.name} successfully finished! Return: ${JSON.stringify(res)}`,
								);
							} else {
								showMessage(
									`Hook ${hook.name} failed! Return: ${JSON.stringify(res)}`,
									0,
									"error",
								);
							}
						})
						.catch((e) => {
							showMessage(
								`Hook ${hook.name} Exception: ${JSON.stringify(e)}`,
								0,
								"error",
							);
						});
				},
			})),
		});
		menu.open({
			x: rect!.right,
			y: rect!.bottom,
			isLeft: true,
		});
	}
}
