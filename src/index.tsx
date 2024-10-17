import { render } from "preact";
import { Plugin, Setting } from "siyuan";
/* import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css'; */
import { z } from "zod";
import "@/index.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
	colorSchemes: {
		dark: true,
	},
});

import MySettings from "@/setting";

const STORAGE_NAME = "SyncHook";

const getRef = <T,>(input: T) => {
	return { current: input };
};

export default class PluginSample extends Plugin {
	async onload() {
		let now_data = {
			...(await this.loadData(STORAGE_NAME)),
		};
		if (!now_data.hooks) {
			now_data.hooks = [];
		}
		const data_schema = z
			.object({
				hooks: z.array(
					z.object({
						id: z.string().default(() => crypto.randomUUID()),
						name: z.string(),
						query: z.string(),
						script: z.string(),
					}),
				),
			})
			.strip();
		now_data = data_schema.parse(now_data) as z.infer<typeof data_schema>;
		console.log(now_data);
		let tmp_data = getRef(
			structuredClone(now_data) as z.infer<typeof data_schema>,
		);
		console.log("ref:");
		console.log(tmp_data);
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
				console.log(tmp_data);
				const new_data = data_schema.parse(tmp_data.current);
				console.log(new_data);
				this.saveData(STORAGE_NAME, new_data);
				now_data = new_data;
			},
			destroyCallback: () => {
				tmp_data = getRef(
					structuredClone(now_data) as z.infer<typeof data_schema>,
				);
			},
		});
		this.setting.addItem({
			title: "Hooks",
			direction: "row",
			description: "all hooks you defined",
			createActionElement: () => {
				const vdom = (
					<ThemeProvider theme={theme}>
						<MySettings tmp_data={tmp_data} />
					</ThemeProvider>
				);
				const e = document.createElement("div");
				render(vdom, e);
				return e;
			},
		});
	}
}
