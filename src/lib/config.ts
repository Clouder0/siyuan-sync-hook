import { proxy } from "valtio";
import { z } from "zod";
import { hook_schema, type type_hook } from "./hook";

export const config_data_schema = z
	.object({ hooks: z.array(hook_schema) })
	.strip();

export type PluginConfigData = z.infer<typeof config_data_schema>;
export type ConfigWriter = ReturnType<
	ReturnType<typeof getConfig>["getWriter"]
>;
export type PluginConfig = ReturnType<typeof getConfig>;

export const getConfig = (old_data: PluginConfigData) => {
	const default_config = { hooks: [] };
	// merge default with old_data
	const now_data = config_data_schema.parse({ ...default_config, ...old_data });

	const res = {
		data: now_data,
		getWriter: () => {
			// generate a new cloned tmp data
			const tmp_data = structuredClone(res.data) as z.infer<
				typeof config_data_schema
			>;
			return proxy({
				data: tmp_data,
				add_hook: () => {
					const new_hook = {
						id: crypto.randomUUID(),
						name: "New Hook",
						query: "",
						script: "",
					};
					tmp_data.hooks.push(new_hook);
					return new_hook;
				},
				modify_hook: (id: string, new_hook: type_hook) => {
					const idx = tmp_data.hooks.findIndex((x) => x.id === id);
					if (idx === -1) {
						throw new Error(`No hook ${id} found`);
					}
					tmp_data.hooks[idx] = new_hook;
				},
				delete_hook: (id: string) => {
					const idx = tmp_data.hooks.findIndex((x) => x.id === id);
					if (idx === -1) {
						throw new Error(`No hook ${id} found`);
					}
					tmp_data.hooks.splice(idx, 1);
				},
			});
		},
	};
	return res;
};
