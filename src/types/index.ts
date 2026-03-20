import type { CSSProperties, ReactNode, UIEvent } from "react";

export interface VirtualizedListHandle {
	scrollToIndex: (index: number) => void;
	scrollTo: (offset: number) => void;
}

export interface VirtualizedListProps<T> {
	data: T[];
	itemHeight: number;

	renderItem: (item: T, index: number) => ReactNode;

	overscan?: number;
	className?: string;
	style?: CSSProperties;

	onScroll?: (e: UIEvent<HTMLDivElement>) => void;
	onEndReached?: () => void;
	onEndReachedThreshold?: number;
}
