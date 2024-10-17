import { run_hook } from "@/lib/hook";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid2 from "@mui/material/Grid2";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { type MutableRef, useState } from "preact/hooks";
import { showMessage } from "siyuan";
import DeleteButton from "./components/delete";

type type_hook = { id: string; name: string; query: string; script: string };

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
const Settings = ({ tmp_data }: { tmp_data: MutableRef<any> }) => {
	const [count, setCount] = useState(0);
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
				{tmp_data.current.hooks.map((hook: type_hook) => (
					<ListItem
						key={hook.id}
						// alignItems="center"
						sx={{ mb: 1, p: 0, border: "1px dashed grey" }}
						disableGutters
					>
						<HookSetting
							hook={hook}
							update={(new_hook) => {
								console.log(new_hook);
								tmp_data.current.hooks = tmp_data.current.hooks.map((h) => {
									if (h.id === hook.id) {
										return new_hook;
									}
									return h;
								});
								setCount(count + 1);
							}}
							on_delete={() => {
								tmp_data.current.hooks = tmp_data.current.hooks.filter(
									(h) => h.id !== hook.id,
								);
								setCount(count + 1);
							}}
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
					variant="contained"
					onClick={() => {
						tmp_data.current.hooks.push({
							id: crypto.randomUUID(),
							name: `testhook${(Math.random() * 100).toFixed(0).toString()}`,
							query: "SELECT * FROM blocks",
							script: "",
						});
						setCount(count + 1); // re-render
					}}
				>
					add
				</Button>
				<button
					type="button"
					class="text-3xl font-bold"
					onClick={() => {
						setCount(count + 1);
						run_hook("testhook").then(() => {
							showMessage("hook success", 6000, "info");
						});
					}}
				>
					fuck
				</button>
			</Paper>
		</Container>
	);
};

export default Settings;
