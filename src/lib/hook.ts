import z from "zod";
import * as api from "./api";

type RawSyncHook = {
	name: string;
	query: string;
	script: string;
};

const sql_res_type = z.array(
	z.object({
		id: z.string(),
		parent_id: z.string(),
		root_id: z.string(),
		created: z.string(),
		updated: z.string(),
		last_update: z.string(),
		content: z.string(),
		markdown: z.string(),
	}),
);
export const run_hook = async (hook_name: string) => {
	const sql_str = `SELECT * FROM 'blocks' b INNER JOIN (SELECT block_id, value AS 'last_update' FROM 'attributes' WHERE name == 'custom-${hook_name}') a  ON b.id  == a.block_id AND b.updated > a.last_update`;
	const res = (await api.sql(sql_str)) ?? [];
	const data = sql_res_type.parse(res);
	await Promise.all(
		data.map(async (item) => {
			console.log(item);
			await api.setBlockAttrs(item.id, {
				"custom-SyncHookLastUpdate": item.updated.toString(),
			});
			console.log(item.updated.toString());
		}),
	);
};
