import { memo, useEffect, useRef } from "react";

interface ListItemProps<T> {
	item: T;
	realIndex: number;
	renderItem: (item: T, index: number) => React.ReactNode;
	updateItemHeight: (index: number, height: number) => void;
	extraData?: unknown;
}

const ListItemComponent = <T,>({
	item,
	realIndex,
	renderItem,
	updateItemHeight,
}: ListItemProps<T>) => {
	const itemRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const node = itemRef.current;
		if (!node) return;

		const observer = new ResizeObserver(() => {
			updateItemHeight(realIndex, node.getBoundingClientRect().height);
		});

		observer.observe(node);
		return () => observer.disconnect();
	}, [realIndex, updateItemHeight]);

	return <div ref={itemRef}>{renderItem(item, realIndex)}</div>;
};

export const ListItem = memo(ListItemComponent, (prevProps, nextProps) => {
	if (prevProps.realIndex !== nextProps.realIndex) return false;
	if (prevProps.item !== nextProps.item) return false;
	if (prevProps.extraData !== nextProps.extraData) return false;
	return true;
}) as typeof ListItemComponent;
