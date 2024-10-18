import z from "zod";
import * as api from "./api";

export const hook_schema = z.object({
	id: z.string(),
	name: z.string(),
	query: z.string(),
	script: z.string(),
});
export type type_hook = z.infer<typeof hook_schema>;

export const sql_res_type = z.array(
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
export type SqlRes = z.infer<typeof sql_res_type>;

export type RuntimeContext = {
	hook: type_hook;
	blocks: SqlRes;
};

/* status codes:
 * 0: success
 * -1: exception
 * -2: function return value parse error
 */
export const hook_return_schema = z
	.object({
		status: z.string(),
		data: z.any(),
		err: z.any(),
	})
	.or(z.null())
	.or(z.undefined());

export const run_hook = async (hook: type_hook) => {
	console.log("Running hook", hook);
	const blocks = (await api.sql(hook.query)) ?? [];
	try {
		const f = new Function("ctx", hook.script);
		const res = f({
			hook: hook,
			blocks: blocks,
		} as RuntimeContext);
		// check if res is promise
		const resolved_res = res instanceof Promise ? await res : res;
		const parsed_res = hook_return_schema.safeParse(resolved_res);
		if (parsed_res.success) {
			return parsed_res.data;
		}
		return {
			status: "-2",
			err: parsed_res.error,
		};
	} catch (e) {
		console.error("Exception while running hook!", hook, e);
		return {
			status: "-1",
			err: e,
		};
	}

	/*  	const sql_str = `SELECT * FROM 'blocks' b INNER JOIN (SELECT block_id, value AS 'last_update' FROM 'attributes' WHERE name == 'custom-${hook_name}') a  ON b.id  == a.block_id AND b.updated > a.last_update`;
	const res = (await api.sql(sql_str)) ?? [];
	const data = sql_res_type.parse(res);
	await Promise.all(
		 data.map(async (item) => {
	 		// console.log(item);
			await api.setBlockAttrs(item.id, {
				"custom-SyncHookLastUpdate": item.updated.toString(),
			});
			console.log(item.updated.toString());
		}),
	); */
};
