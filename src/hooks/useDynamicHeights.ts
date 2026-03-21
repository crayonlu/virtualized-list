import { useMemo, useReducer, useRef } from "react";
import type { PositionCache } from "@/types";

export function useDynamicHeights(estimatedHeight: number, dataLength: number) {
	const positionsRef = useRef<PositionCache[]>([]);
	const [, forceUpdate] = useReducer((x) => x + 1, 0);
	useMemo(() => {
		const currentLen = positionsRef.current.length;
		if (currentLen < dataLength) {
			const baseTop = currentLen === 0 ? 0 : positionsRef.current[currentLen - 1]!.bottom;
			const newPositions = Array.from({ length: dataLength - currentLen }, (_, i) => {
				const index = currentLen + i;
				const top = baseTop + i * estimatedHeight;
				const bottom = top + estimatedHeight;

				return { index, height: estimatedHeight, top, bottom };
			});
			positionsRef.current.push(...newPositions);
		}
	}, [dataLength, estimatedHeight]);

	const updateItemHeight = (index: number, realHeight: number) => {
		const positions = positionsRef.current;
		const currentItem = positions[index];
		if (!currentItem) return;
		const oldHeight = currentItem.height;
		const diff = realHeight - oldHeight;
		if (diff === 0) return;

		currentItem.height = realHeight;
		currentItem.bottom = currentItem.bottom + diff;

		for (let i = index + 1; i < positions.length; i++) {
			const prevItem = positions[i - 1]!;
			const currItem = positions[i]!;

			currItem.top = prevItem.bottom;
			currItem.bottom = currItem.bottom + diff;
		}
		forceUpdate();
	};

	const getTotalHeight = () => {
		const positions = positionsRef.current;
		if (positions.length === 0) return 0;
		return positions[positions.length - 1]!.bottom;
	};

	const getStartIndex = (scrollTop: number) => {
		const positions = positionsRef.current;
		if (positions.length === 0) return 0;
		const maxScrollTop = positions[positions.length - 1]!.bottom;
		if (scrollTop >= maxScrollTop) return positions.length - 1;
		let left = 0;
		let right = positions.length - 1;
		let startIndex = 0;

		while (left <= right) {
			const mid = Math.floor((left + right) / 2);
			const midItem = positions[mid]!;

			if (midItem.bottom > scrollTop) {
				startIndex = mid;
				right = mid - 1;
			} else {
				left = mid + 1;
			}
		}
		return startIndex;
	};

	const getOffsetTop = (index: number) => {
		const positions = positionsRef.current;
		return positions[index]?.top || 0;
	};

	return {
		positions: positionsRef.current,
		updateItemHeight,
		getTotalHeight,
		getStartIndex,
		getOffsetTop,
	};
}
