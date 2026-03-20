import { VirtualizedList } from "../../src/index";
import "./App.css";
import type { ReactNode } from "react";

function App() {
	return (
		<div className="App">
			<VirtualizedList
				data={new Array(1000).fill(0).map((_, i) => `Item ${i + 1}`)}
				itemHeight={30}
				style={{ height: 300, width: 200, border: "1px solid #ccc" }}
				renderItem={(item: ReactNode) => <div style={{ height: 30 }}>{item}</div>}
			/>
		</div>
	);
}

export default App;
