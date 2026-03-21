import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { useDynamicHeights } from "@/hooks/useDynamicHeights";
import type { VirtualizedListProps, VirtualizedListRef } from "@/types";
import { ListItem } from "@/components/ListItem";

const VirtualizedListBase = forwardRef<VirtualizedListRef, VirtualizedListProps<unknown>>(
	function VirtualizedListInner(props, ref) {
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
		const trackingTargetIndexRef = useRef<number | null>(null);
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

		useImperativeHandle(
			ref,
			() => ({
				scrollToIndex: (index: number, options?: { behavior?: ScrollBehavior }) => {
					const validIndex = Math.max(0, Math.min(index, data.length - 1));
					const container = containerRef.current;
					if (!container) return;

					const behavior = options?.behavior ?? "auto";
					if (behavior === "smooth") {
						trackingTargetIndexRef.current = null;
						container.scrollTo({ top: getOffsetTop(validIndex), behavior });
						return;
					}

					trackingTargetIndexRef.current = validIndex;
					container.scrollTop = getOffsetTop(validIndex);
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
				container.scrollTop = targetTop;
			} else {
				trackingTargetIndexRef.current = null;
			}
		});

		const dataLength = data.length;
		const totalHeight = getTotalHeight();

		const startIndex = Math.max(0, getStartIndex(scrollTop) - overscan);
		const endIndex = Math.min(
			dataLength - 1,
			getStartIndex(scrollTop + containerHeight) + overscan
		);
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
);

export const VirtualizedList = VirtualizedListBase as <T>(
	props: VirtualizedListProps<T> & { ref?: React.ForwardedRef<VirtualizedListRef> }
) => ReturnType<typeof VirtualizedListBase>;
