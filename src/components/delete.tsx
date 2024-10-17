import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";

const DeleteButton = ({ onDelete }: { onDelete: () => void }) => {
	const [clickOnce, setClickOnce] = useState(false);

	return (
		<div>
			<IconButton
				color={clickOnce ? "error" : "success"}
				style={{ width: 48, height: 48 }}
				onClick={() => (!clickOnce ? setClickOnce(true) : onDelete())}
			>
				{clickOnce ? <DeleteIcon /> : <DeleteIcon />}
			</IconButton>
		</div>
	);
};

export default DeleteButton;
