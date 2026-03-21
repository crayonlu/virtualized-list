# lite-virtualized-list

A React component library for rendering large lists efficiently using virtualization techniques. It provides a simple and customizable API for developers to create performant list components that can handle thousands of items without sacrificing user experience.

## Features

- **Virtualization** - Only renders visible items for maximum performance
- **Dynamic Heights** - Automatically handles items with variable heights
- **TypeScript** - Full TypeScript support with generic types
- **Smooth Scrolling** - GPU-accelerated scrolling with RAF throttling
- **Overscan** - Configurable overscan for smooth scrolling experience
- **Memoization** - Fine-grained memoization prevents unnecessary re-renders

## Installation

```bash
npm install lite-virtualized-list
# or
bun add lite-virtualized-list
```

## Quick Start
see [demo](./demo)

## API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `T[]` | ✅ | - | Array of items to render |
| `itemHeight` | `number` | ✅ | - | Estimated height of each item in pixels |
| `renderItem` | `(item: T, index: number) => ReactNode` | ✅ | - | Render function for each item |
| `keyExtractor` | `(item: T, index: number) => React.Key` | - | `index` | Function to extract item key |
| `overscan` | `number` | - | `5` | Number of extra items to render outside viewport |
| `className` | `string` | - | `''` | CSS class for container |
| `style` | `CSSProperties` | - | `{}` | Inline styles for container |
| `extraData` | `any` | - | - | Extra data to trigger re-renders |
| `onScroll` | `(e: UIEvent) => void` | - | - | Scroll event callback |
| `onEndReached` | `() => void` | - | - | Callback when scrolled to end |
| `onEndReachedThreshold` | `number` | - | `100` | Threshold in pixels from end to trigger `onEndReached` |

### Ref Methods

Use a component ref to call imperative scrolling methods:

| Method | Type | Description |
|------|------|-------------|
| `scrollToIndex` | `(index: number, options?: { behavior?: ScrollBehavior }) => void` | Scroll to a zero-based item index |

`scrollToIndex` options:

| Option | Type | Default | Description |
|------|------|---------|-------------|
| `behavior` | `'auto' \| 'smooth'` | `'auto'` | Scroll animation behavior. Use `'smooth'` for animated scrolling |

Example:

```tsx
listRef.current?.scrollToIndex(500, { behavior: "smooth" });
```
