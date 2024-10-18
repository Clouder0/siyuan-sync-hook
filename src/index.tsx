/* import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css'; */
import { PluginContext } from "@/lib/context";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { render } from "preact";
import { Plugin, Setting } from "siyuan";

const theme = createTheme({
	colorSchemes: {
		dark: true,
	},
});

import MySettings from "@/setting";
import { config_data_schema, getConfig } from "./lib/config";

const STORAGE_NAME = "SyncHook";

export default class PluginSample extends Plugin {
	plugin_context = {} as PluginContext;

	async onload() {
		const load_context = this.plugin_context;
		const conf = getConfig(await this.loadData(STORAGE_NAME));
		console.log("loaded confl", conf);
		load_context.config = conf;

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
	}
}
