import { Plugin, Setting } from "siyuan";
import SettingExample from "@/setting-example";
import { render } from "preact";
import "@/index.css"

import type {} from "solid-styled-jsx";

export default class PluginSample extends Plugin {
	async onload() {
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
			},
		});
		this.setting.addItem({
			title: "Some title",
			direction: "row",
			description: "some desp",
			createActionElement: () => {
				const hey = Math.random();
				const vdom = (
					<div>
						<SettingExample />
						<p>{hey}</p>
					</div>
				);
				const e = document.createElement("div");
				render(vdom, e);
				return e;
			},
		});
	}
}
