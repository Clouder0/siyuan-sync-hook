import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid2 from "@mui/material/Grid2";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useContext } from "preact/hooks";
import { useSnapshot } from "valtio";
import DeleteButton from "./components/delete";
import { PluginContext } from "./lib/context";
import type { type_hook } from "./lib/hook";

const HookSetting = (props: {
	hook: type_hook;
	update: (v: type_hook) => void;
	on_delete: () => void;
}) => {
	return (
		<Stack direction="column" spacing={2} sx={{ m: 0, p: 2, width: "100%" }}>
			<Grid2
				container
				spacing={2}
				sx={{
					m: 0,
					p: 0,
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Grid2 size={3}>
					<TextField
						defaultValue={props.hook.name}
						label="Name"
						variant="outlined"
						sx={{ width: "100%" }}
						onChange={(e) => {
							props.update({
								...props.hook,
								name: (e.target as unknown as { value: string }).value,
							});
						}}
					/>
				</Grid2>
				<Grid2 size="grow">
					<TextField
						defaultValue={props.hook.query}
						label="Query"
						variant="outlined"
						sx={{ width: "100%" }}
						onChange={(e) => {
							props.update({
								...props.hook,
								query: (e.target as unknown as { value: string }).value,
							});
						}}
					/>
				</Grid2>
				<Grid2 size="auto">
					<DeleteButton onDelete={() => props.on_delete()} />
				</Grid2>
			</Grid2>
			<TextField
				defaultValue={props.hook.script}
				label="Script"
				variant="outlined"
				multiline
				minRows={2}
				onChange={(e) => {
					props.update({
						...props.hook,
						script: (e.target as unknown as { value: string }).value,
					});
				}}
			/>
		</Stack>
	);
};
const Settings = () => {
	const ctx = useContext(PluginContext);

	// still loading data
	if (ctx.config_writer === undefined) return <></>;

	const nowconf = useSnapshot(ctx.config_writer);
	console.log("Render Settings with ctx", ctx, "nowconf", nowconf);
	return (
		<Container>
			<List
				sx={{
					maxHeight: "60vh",
					overflowY: "scroll",
					overflowX: "visible",
					p: 2,
					mb: 2,
				}}
			>
				{nowconf.data.hooks.map((hook: type_hook) => (
					<ListItem
						key={hook.id}
						// alignItems="center"
						sx={{ mb: 1, p: 0, border: "1px dashed grey" }}
						disableGutters
					>
						<HookSetting
							hook={hook}
							update={(new_hook) => nowconf.modify_hook(hook.id, new_hook)}
							on_delete={() => nowconf.delete_hook(hook.id)}
						/>
					</ListItem>
				))}
			</List>
			<Paper
				elevation={12}
				variant="outlined"
				sx={{ position: "sticky", bottom: 0 }}
			>
				<Button
					size="large"
					color="primary"
					sx={{ width: "100%" }}
					variant="contained"
					onClick={() => nowconf.add_hook()}
				>
					Add
				</Button>
			</Paper>
		</Container>
	);
};

export default Settings;
