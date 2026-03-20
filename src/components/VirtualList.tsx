import { useEffect, useRef, useState } from "react";
import { useDynamicHeights } from "@/hooks/useDynamicHeights";
import type { VirtualizedListProps } from "@/types";
import { ListItem } from "@/components/ListItem";

export function VirtualizedList<T>(props: VirtualizedListProps<T>) {
	const {
		data,
		itemHeight,
		renderItem,
		keyExtractor,
		overscan = 5,
		className = "",
		style = {},
		onScroll,
		onEndReached,
		onEndReachedThreshold = 100,
		extraData,
	} = props;
	const { getTotalHeight, getStartIndex, updateItemHeight, getOffsetTop } = useDynamicHeights(
		itemHeight,
		data.length
	);
	const containerRef = useRef<HTMLDivElement>(null);
	const [scrollTop, setScrollTop] = useState(0);
	const [containerHeight, setContainerHeight] = useState(0);
	const lastNotifiedDataLength = useRef(0);
	const rafId = useRef<number | null>(null);
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
		const target = e.currentTarget;
		const currentScrollTop = target.scrollTop;
		const clientHeight = target.clientHeight;
		const scrollHeight = target.scrollHeight;

		if (rafId.current !== null) {
			cancelAnimationFrame(rafId.current);
		}

		rafId.current = requestAnimationFrame(() => {
			setScrollTop(currentScrollTop);

			onScroll?.(e);

			if (onEndReached && scrollHeight - currentScrollTop - clientHeight <= onEndReachedThreshold) {
				if (lastNotifiedDataLength.current !== dataLength) {
					lastNotifiedDataLength.current = dataLength;
					onEndReached();
				}
			}

			rafId.current = null;
		});
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
					// use transform3d for GPU acceleration and smoother scrolling
					transform: `translate3d(0, ${offsetY}px, 0)`,
				}}
			>
				{visibleData.map((item, index) => {
					const realIndex = startIndex + index;
					return (
						<ListItem
							key={keyExtractor ? keyExtractor(item, realIndex) : realIndex}
							item={item}
							realIndex={realIndex}
							renderItem={renderItem}
							updateItemHeight={updateItemHeight}
							extraData={extraData}
						/>
					);
				})}
			</div>
		</div>
	);
}
