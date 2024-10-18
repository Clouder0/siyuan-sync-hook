// expose all plugin external state in React Context

import { createContext } from "preact";
import type { ConfigWriter, PluginConfig } from "./config";

export type PluginContext = {
	config?: PluginConfig;
	config_writer?: ConfigWriter;
};

export const PluginContext = createContext({} as PluginContext);
