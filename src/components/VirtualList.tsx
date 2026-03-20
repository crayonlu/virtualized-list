import { useEffect, useRef, useState } from "react";
import { useDynamicHeights } from "@/hooks/useDynamicHeights";
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
	const { getTotalHeight, getStartIndex, updateItemHeight, getOffsetTop } = useDynamicHeights(
		itemHeight,
		data.length
	);
	const containerRef = useRef<HTMLDivElement>(null);
	const [scrollTop, setScrollTop] = useState(0);
	const [containerHeight, setContainerHeight] = useState(0);
	const lastNotifiedDataLength = useRef(0);

	useEffect(() => {
		const containerElement = containerRef.current;
		if (!containerElement) return;
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setContainerHeight(entry.contentRect.height);
			}
		});
		observer.observe(containerElement);

		return () => {
			observer.disconnect();
		};
	}, []);

	const dataLength = data.length;
	const totalHeight = getTotalHeight();

	const startIndex = Math.max(0, getStartIndex(scrollTop) - overscan);
	const endIndex = Math.min(dataLength - 1, getStartIndex(scrollTop + containerHeight) + overscan);
	const offsetY = getOffsetTop(startIndex);
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
						<div
							key={realIndex}
							ref={(node) => {
								if (node) {
									const rect = node.getBoundingClientRect();
									updateItemHeight(realIndex, rect.height);
								}
							}}
						>
							{renderItem(item, realIndex)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
