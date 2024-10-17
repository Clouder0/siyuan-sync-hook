import { useState } from "preact/hooks";
import { showMessage } from "siyuan";

const App = (_props) => {
	const [count, setCount] = useState(0);
	return (
		<>
			<p class="text-3xl font-bold">hey {count}</p>
			<button
				type="button"
				onClick={() => {
					setCount(count + 1);
				}}
			/>
		</>
	);
};

export default App;
