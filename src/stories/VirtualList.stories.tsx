import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef } from "react";
import { VirtualizedList } from "../components/VirtualList";
import type { VirtualizedListRef } from "../types";

interface MockItem {
	id: number;
	title: string;
	content: string;
}

const generateMockData = (count: number): MockItem[] =>
	new Array(count).fill(0).map((_, i) => {
		const repeatCount = Math.floor(Math.random() * 4) + 1;
		return {
			id: i,
			title: `Item ${i + 1}`,
			content: "Dynamic height content ".repeat(repeatCount).trim(),
		};
	});

const containerStyle = {
	display: "flex",
	flexDirection: "column" as const,
	alignItems: "center",
	padding: "40px",
	height: "100vh",
	fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const listContainerStyle = {
	height: 480,
	width: 360,
	background: "#fff",
	border: "1px solid #e8e8e8",
};

const itemStyle = {
	padding: "20px 10px",
	borderBottom: "1px solid #f0f0f0",
};

const titleStyle = {
	color: "#1a1a1a",
	fontSize: "15px",
	fontWeight: 600,
	marginBottom: "8px",
	letterSpacing: "-0.01em",
};

const contentStyle = {
	color: "#666",
	fontSize: "13px",
	lineHeight: 1.6,
};

const buttonBase = {
	padding: "10px 20px",
	fontSize: "13px",
	fontWeight: 500,
	border: "none",
	borderRadius: "8px",
	cursor: "pointer" as const,
};

const meta: Meta = {
	title: "Components/VirtualizedList",
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"A high-performance virtualized list component with dynamic height support, smooth scrolling, and end-reached detection.",
			},
		},
	},
	tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj = {
	render: () => {
		const data = generateMockData(1000);
		return (
			<div style={containerStyle}>
				<VirtualizedList<MockItem>
					data={data}
					itemHeight={100}
					overscan={5}
					style={listContainerStyle}
					renderItem={(item) => (
						<div style={itemStyle}>
							<div style={titleStyle}>
								#{item.id} {item.title}
							</div>
							<div style={contentStyle}>{item.content}</div>
						</div>
					)}
				/>
			</div>
		);
	},
};

export const WithScrollToIndex: StoryObj = {
	render: () => {
		const listRef = useRef<VirtualizedListRef>(null);
		const data = generateMockData(500);
		return (
			<div style={containerStyle}>
				<div style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
					<button
						type="button"
						onClick={() => listRef.current?.scrollToIndex(100)}
						style={{ ...buttonBase, background: "#1a1a1a", color: "#fff" }}
					>
						Scroll to 100
					</button>
					<button
						type="button"
						onClick={() => listRef.current?.scrollToIndex(250)}
						style={{
							...buttonBase,
							background: "#fff",
							color: "#1a1a1a",
							border: "1px solid #e0e0e0",
						}}
					>
						Scroll to 250
					</button>
					<button
						type="button"
						onClick={() => listRef.current?.scrollToIndex(400)}
						style={{
							...buttonBase,
							background: "#fff",
							color: "#1a1a1a",
							border: "1px solid #e0e0e0",
						}}
					>
						Scroll to 400
					</button>
				</div>
				<VirtualizedList<MockItem>
					ref={listRef}
					data={data}
					itemHeight={120}
					overscan={5}
					style={listContainerStyle}
					renderItem={(item) => (
						<div style={itemStyle}>
							<div style={titleStyle}>
								#{item.id} {item.title}
							</div>
							<div style={contentStyle}>{item.content}</div>
						</div>
					)}
				/>
			</div>
		);
	},
};

export const LargeDataset: StoryObj = {
	render: () => {
		const data = generateMockData(10000);
		return (
			<div style={containerStyle}>
				<p style={{ color: "#888", fontSize: "13px", marginBottom: "20px" }}>
					Rendering 10,000 items with dynamic heights
				</p>
				<VirtualizedList<MockItem>
					data={data}
					itemHeight={100}
					overscan={5}
					style={listContainerStyle}
					renderItem={(item) => (
						<div style={itemStyle}>
							<div style={titleStyle}>
								#{item.id} {item.title}
							</div>
							<div style={contentStyle}>{item.content}</div>
						</div>
					)}
				/>
			</div>
		);
	},
};

export const CompactList: StoryObj = {
	render: () => {
		const data = generateMockData(50);
		return (
			<div style={containerStyle}>
				<VirtualizedList<MockItem>
					data={data}
					itemHeight={70}
					overscan={3}
					style={{ ...listContainerStyle, height: 400, width: 320 }}
					renderItem={(item) => (
						<div style={{ padding: "12px 6px", borderBottom: "1px solid #f5f5f5" }}>
							<div style={{ color: "#1a1a1a", fontSize: "14px", fontWeight: 500 }}>
								{item.title}
							</div>
							<div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>
								{item.content}
							</div>
						</div>
					)}
				/>
			</div>
		);
	},
};
