import { useRef, useState } from "react";
import type { VirtualizedListProps } from "@/types";

export function VirtualizedList<T>(props: VirtualizedListProps<T>) {
	const {
		data,
		itemHeight,
		renderItem,
		overscan = 5,
		className = "",
		style = {},
		onScroll,
		onEndReached,
		onEndReachedThreshold = 100,
	} = props;
	const containerRef = useRef<HTMLDivElement>(null);
	const [scrollTop, setScrollTop] = useState(0);
	const lastNotifiedDataLength = useRef(0);
	const dataLength = data.length;
	const totalHeight = dataLength * itemHeight;

	const containerHeight = containerRef.current?.clientHeight || 0;
	const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
	const endIndex = Math.min(
		dataLength - 1,
		Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
	);
	const offsetY = startIndex * itemHeight;
	const visibleData = data.slice(startIndex, endIndex + 1);
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		setScrollTop(e.currentTarget.scrollTop);
		onScroll?.(e);

		if (
			onEndReached &&
			e.currentTarget.scrollHeight - e.currentTarget.scrollTop - e.currentTarget.clientHeight <=
				onEndReachedThreshold
		) {
			if (lastNotifiedDataLength.current !== dataLength) {
				lastNotifiedDataLength.current = dataLength;
				onEndReached();
			}
		}
	};
	return (
		<div
			ref={containerRef}
			className={className}
			style={{ ...style, overflowY: "auto", position: "relative" }}
			onScroll={handleScroll}
		>
			{/* ghost */}
			<div style={{ height: totalHeight }}></div>

			{/* visible items */}
			<div
				style={{
					position: "absolute",
					top: 0,
					width: "100%",
					transform: `translateY(${offsetY}px)`,
				}}
			>
				{visibleData.map((item, index) => {
					const realIndex = startIndex + index;
					return (
						<div key={realIndex} style={{ height: itemHeight }}>
							{renderItem(item, realIndex)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
