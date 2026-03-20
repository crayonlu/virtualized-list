import type React from "react";
import type { CSSProperties, ReactNode, UIEvent } from "react";

export interface VirtualizedListProps<T> {
	data: T[];
	itemHeight: number;

	renderItem: (item: T, index: number) => ReactNode;
	keyExtractor?: (item: T, index: number) => React.Key;
	overscan?: number;
	className?: string;
	style?: CSSProperties;

	onScroll?: (e: UIEvent<HTMLDivElement>) => void;
	onEndReached?: () => void;
	onEndReachedThreshold?: number;

	extraData?: any;
}

export interface PositionCache {
	index: number;
	height: number;
	top: number;
	bottom: number;
}
