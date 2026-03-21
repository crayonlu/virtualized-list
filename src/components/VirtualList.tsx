import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ListItem } from "@/components/ListItem";
import { useDynamicHeights } from "@/hooks/useDynamicHeights";
import type { VirtualizedListProps, VirtualizedListRef } from "@/types";

const VirtualizedListBase = forwardRef<VirtualizedListRef, VirtualizedListProps<unknown>>(
	function VirtualizedListInner(props, ref) {
		const {
			data,
			itemHeight,
			initialItemCount,
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
		const trackingTargetIndexRef = useRef<number | null>(null);
		const isProgrammaticScrollRef = useRef(false);
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

			const handleInteraction = () => {
				trackingTargetIndexRef.current = null;
			};
			containerElement.addEventListener("wheel", handleInteraction, { passive: true });
			containerElement.addEventListener("touchstart", handleInteraction, { passive: true });
			containerElement.addEventListener("mousedown", handleInteraction, { passive: true });

			return () => {
				observer.disconnect();
				containerElement.removeEventListener("wheel", handleInteraction);
				containerElement.removeEventListener("touchstart", handleInteraction);
				containerElement.removeEventListener("mousedown", handleInteraction);
			};
		}, []);
		useImperativeHandle(
			ref,
			() => ({
				scrollToIndex: (index: number) => {
					const validIndex = Math.max(0, Math.min(index, data.length - 1));
					const container = containerRef.current;
					if (!container) return;

					const targetTop = getOffsetTop(validIndex);
					trackingTargetIndexRef.current = validIndex;
					isProgrammaticScrollRef.current = true;
					container.scrollTop = targetTop;
					setScrollTop(targetTop);
				},
			}),
			[data.length, getOffsetTop]
		);
		useEffect(() => {
			const targetIndex = trackingTargetIndexRef.current;
			const container = containerRef.current;
			if (targetIndex === null || !container) return;
			const targetTop = getOffsetTop(targetIndex);
			if (Math.abs(container.scrollTop - targetTop) > 1) {
				isProgrammaticScrollRef.current = true;
				container.scrollTop = targetTop;
				setScrollTop(targetTop);
			} else {
				const timer = setTimeout(() => {
					if (trackingTargetIndexRef.current === targetIndex) trackingTargetIndexRef.current = null;
				}, 10);
				return () => clearTimeout(timer);
			}
		});

		const dataLength = data.length;
		const totalHeight = getTotalHeight();

		const isInitialRender = containerHeight === 0;

		const startIndex = Math.max(0, getStartIndex(scrollTop) - overscan);
		const endIndex =
			isInitialRender && initialItemCount
				? initialItemCount - 1
				: Math.min(dataLength - 1, getStartIndex(scrollTop + containerHeight) + overscan);
		const offsetY = getOffsetTop(startIndex);
		const visibleData = data.slice(startIndex, endIndex + 1);
		const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
			const target = e.currentTarget;
			const currentScrollTop = target.scrollTop;
			const clientHeight = target.clientHeight;
			const scrollHeight = target.scrollHeight;

			if (isProgrammaticScrollRef.current) {
				isProgrammaticScrollRef.current = false;
				return;
			}

			if (rafId.current !== null) cancelAnimationFrame(rafId.current);

			rafId.current = requestAnimationFrame(() => {
				setScrollTop(currentScrollTop);

				onScroll?.(e);

				if (
					onEndReached &&
					scrollHeight - currentScrollTop - clientHeight <= onEndReachedThreshold
				) {
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
				style={{ ...style, overflowY: "auto", position: "relative", overflowAnchor: "none" }}
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
);

export const VirtualizedList = VirtualizedListBase as <T>(
	props: VirtualizedListProps<T> & { ref?: React.ForwardedRef<VirtualizedListRef> }
) => ReturnType<typeof VirtualizedListBase>;
