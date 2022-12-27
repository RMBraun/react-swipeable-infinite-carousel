# react-swipeable-infinite-carousel

Simple swipeable, draggable, and scrollable React carousel component.
[A demo of the carousel can be seen here](https://rmbraun.github.io/react-swipeable-infinite-carousel/)

Supports infinite scrolling and slides of varying widths.

## How to install:

```
npm install @rybr/react-swipeable-infinite-carousel

yarn add @rybr/react-swipeable-infinite-carousel
```

## Working on:
- handle mouse wheel scroll correctly
- auto-scroll feature
- further optimizations
- scroll arrows scroll by displayed tile count for infinite carousel

## How to use

```jsx
import { Carousel, Arrows, Indexes } from '@rybr/react-swipeable-infinite-carousel'

//OPTIONAL - can create custom scroll arrows
const CustomArrow = ({ 
  isLeft, //boolean to indicate if this is the right or left arrow
  isHidden, //should the arrow be hidden? (true during scrollings, dragging, and when there is nothing to scroll)
  scrollBy //function which takes a number input and will scroll by that amount
}) => {
  const onClick = useCallback((scrollCount) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    scrollBy(scrollCount)
  }, [scrollBy])

  return (
    <button
      className={'customArrowCss'}
      style={{
        opacity: isHidden ? 0 : 0.5
      }}
      onClick={onClick(isLeft ? -1 : 1)}
    >
      <span className={isLeft ? 'leftArrowIcon' : 'rightArrowIcon'} />
    </button>
  )
}

//OPTIONAL - can create custom tile index footer
const CustomIndexes = ({ 
  activeIndexes, //Array of numbers specifying which indexes are active
  startIndex, //index of the left-most displayed item
  endIndex,  //index of the right-most displayed item
  slideAnchors, //information about each slide (start and end scroll offsets and slide width)
  scrollBy, //function which takes a number input and will scroll by that amount
]}) => {
  const onClick = useCallback(
    (scrollCount) => (e) => {
      scrollBy(scrollCount)
    },
    [scrollBy],
  )

  return (
    <div
      className={'customIndexes'}
    >
      {slideAnchors?.map((_, i) => (
        <button
          key={i}
          className={`customIndex ${activeIndexes.includes(i) ? 'isActive' : ''}`}
          onClick={onClick(i - startIndex)}
        />
      ))}
    </div>
  )
}

//NOTE: all props are optional. These are all set as examples
<Carousel
  isInfinite={true} //whether the carousel is infinite scrolling or not
  startIndex={4} //which index to start on
  isScrollable={true} //whether scrolling using a mouse or trackpad is allowed
  isDraggable={true} //whether dragging by mouse or touch is allowed
  hasDragMomentum={true} //whether scroll momentum is added when dragging
  dragMomentumSpeed={25} //maximum momentum scroll speed in pixels
  dragMomentumDecay={0.98} //scroll momentum decay rate
  gridGap={15} //gap between each tile in px
  displayCount={4} //maximum number of tiles to display
  minDisplayCount={2} //minimum number of tiles to display
  arrowLeftProps={{ onClick: customOnClick }} //props to be sent to the left arrow
  arrowRightProps={{ onClick: customOnClick }} //props to be sent to the right arrow
  arrows={Arrows | CustomArrow} //use built-in Arrows or custom scroll arrows
  scrollSpeed={75} //maximum scroll speed in pixels
  style={ backgroundColor: 'red' } //container inline style overrides
  slideContainerStyle={ border: '1px solid blue' } //slides container inline style overrides
  slideStyle={ opacity: 0.5 } //slide container inline style overrides
  indexes={Indexes | CustomIndexes} //use built-in Indexes or custom indexes
  indexesPerRow={2} //how many indexes to show per row. Each index will be (container width) / indexesPerRow
  indexContainerProps={{ style: { background: blue }}} //props to be sent to the scroll index container
  indexProps={{ className: 'customClassName' }} //props to be sent to the scroll indexes
  shouldScrollByDisplayCount={true} //if true then scroll arrows will scroll by the displayed tile count else will scroll 1 tile at a time
  scrollCount={3} //number of tiles to scroll per scroll arrow click. "shouldScrollByDisplayCount" overrides this value
  customIndexes={CustomIndexes} //custom scroll indexes 
>
  {randomColors.map((color, i) => (
    <div key={i} style={tileCss}>
      {i + 1}
    </div>
  ))}
</Carousel>
```

|  	| **Type** 	| **Default Value** 	| **Description** 	|
|---	|---	|---	|---	|
| **isInfinite** 	| boolean 	| false 	| Toggles whether the infinite scrolling is enabled 	|
| **startIndex** 	| int 	| 0 	| Which index to start on 	|
| **isScrollable** 	| boolean 	| true 	| Is the carousel scrollable (mouse wheel + trackpad) 	|
| **isDraggable** 	| boolean 	| true 	| Is the carousel draggable (mouse drag + touch screens) 	|
| **hasDragMomentum** 	| boolean 	| true 	| Toggles whether there is momentum when dragging (mimics scroll momentum for touch events) 	|
| **dragMomentumSpeed** 	| number 	| 25 	| Maximum speed in pixels that the drag momentum can be 	|
| **dragMomentumDecay** 	| number 	| 0.98 	| The rate of decay of the drag momentum (mulplicative with itself). Each frame, the drag momentum speed will be 98% of what it was last frame. 	|
| **displayCount** 	| int 	| 0 	| How many slides you wish to display. <br>If no value or 0 is set then the carousel will take up maximum width.<br>Overflow will be hidden.<br>Carousel `width` CSS property will be equal to the smallest value needed in order to display the desired slide count. 	|
| **minDisplayCount** 	| int 	| 0 	| Minimum number of slides to display.<br>If no value or 0 is set then no minimum width will be applied.<br>Overflow is **not** hidden.<br>Carousel `min-width` CSS property will be equal to the smallest value needed in order to display the desired slide count. 	|
| **gridGap** 	| number 	| 10 	| The gap between tiles in CSS pixels 	|
| **style** 	| React.CSSProperties 	| {} 	| Inline style used to overwrite the default Carousel container CSS 	|
| **slideContainerStyle** 	| React.CSSProperties 	| {} 	| Inline style used to overwrite the default `<div>` that wraps the slides (children) 	|
| **slideStyle** 	| React.CSSProperties 	| {} 	| Inline style used to overwrite the default `<div>` that wraps each slide (each child) 	|
| **arrowLeftProps** 	| Record<string, unknown> 	| {} 	| props to send to the left arrow container 	|
| **arrowRightProps** 	| Record<string, unknown> 	| {} 	| props to send to the right arrow container 	|
| **scrollSpeed** 	| number 	| 75 	| The maximum scroll speed allowed in pixels 	|
| **arrows** 	| React.FC<RenderArrowsProps> 	|  	| Function that returns a React.Element to be used as the scroll arrows. 	|
| **indexesPerRow** 	| number 	| 0 	| How many indexes to show per row (will wrap). <br>A value of 0, null, or undefined, is the equivalent to setting the value to 1. 	|
| **indexContainerProps** 	| Record<string, unknown> 	| {} 	| props to send to the index container 	|
| **indexProps** 	| Record<string, unknown> 	| {} 	| props to send to the index icon 	|
| **indexes** 	| React.FC<RenderIndexesProps> 	|  	| Function that returns a React.Element to be used as the scroll indexes 	|
| **shouldScrollByDisplayCount (disabled for infinite)**  	| boolean 	| true 	| If true then scroll arrows will scroll by the displayed tile count else will scroll "scrollCount" tile(s) at a time 	|
| **scrollCount (disabled for infinite)** 	| number 	| 1 	| Number of tiles to scroll per scroll arrow click. "shouldScrollByDisplayCount" overrides this value 	|
| **children** 	| React.Node \| Array<React.Node> 	|  	| The slides you wish to display in the carousel 	|