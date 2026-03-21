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

/**
 * Options for programmatic list scrolling.
 */
export interface ScrollToIndexOptions {
	/**
	 * Native scroll animation behavior.
	 *
	 * - `"auto"`: jump to target position immediately
	 * - `"smooth"`: animate to target position smoothly
	 *
	 * @defaultValue "auto"
	 */
	behavior?: ScrollBehavior;
}

export interface VirtualizedListRef {
	/**
	 * Scrolls the list to a specific item index.
	 *
	 * @param index zero-based item index
	 * @param options scrolling behavior options
	 */
	scrollToIndex: (index: number, options?: ScrollToIndexOptions) => void;
}
