import { VirtualizedList } from "lite-virtualized-list";
import "./App.css";

const mockData = new Array(1000).fill(0).map((_, i) => {
	const repeatCount = Math.floor(Math.random() * 6) + 1;
	return {
		id: i,
		title: `Item ${i + 1}`,
		content: "This is a simple content.".repeat(repeatCount),
	};
});

function App() {
	return (
		<div
			className="App"
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<VirtualizedList
				data={mockData}
				itemHeight={100}
				style={{
					height: 500,
					width: 350,
					border: "1px solid #ccc",
				}}
				renderItem={(item, index) => (
					<div
						style={{
							padding: "16px",
							borderBottom: "1px solid #eee",
							color: "#333",
							fontSize: "14px",
						}}
					>
						<div style={{ color: "#1890ff", fontWeight: "bold", marginBottom: "8px" }}>
							#{index} {item.title}
						</div>
						<div style={{ color: "#666" }}>{item.content}</div>
					</div>
				)}
			/>
		</div>
	);
}

export default App;
