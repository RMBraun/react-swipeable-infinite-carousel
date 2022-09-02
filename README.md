# react-swipeable-infinite-carousel

Simple swipeable, draggable, and scrollable React carousel component.
[A demo of the carousel can be seen here](https://rmbraun.github.io/react-swipeable-infinite-carousel/)

## Currently in progress:

- Infinite carousel
- index tracker + custom index tracker

## How to install:

```
npm install @rybr/react-swipeable-infinite-carousel

yarn add /react-swipeable-infinite-carousel
```

## How to use

```jsx
import { Carousel } from '@rybr/react-swipeable-infinite-carousel'

const CustomArrow = ({ isLeft, isHidden, scrollBy }) => {
  const onClick = useCallback((scrollCount) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    scrollBy(scrollCount)
  })

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

<Carousel
  startIndex={4} //which index to start on
  gridGap={15} //gap between each tile in px
  displayCount={4} //maximum number of tiles to display
  minDisplayCount={2} //minimum number of tiles to display
  showArrows={!isMobile} //toggles displaying the prebuilt scroll arrows
  renderArrows={CustomArrow} //function that returns a React.Element (custom scroll arrows)
  scrollSpeed={75} //maximum scroll speed in pixels
  style={ backgroundColor: 'red' } //container inline style overrides
  slideContainerStyle={ border: '1px solid blue' } //slides container inline style overrides
  slideStyle={ opacity: 0.5 } //slide container inline style overrides
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
| **startIndex** 	| int 	| 0 	| Which index to start on 	|
| **displayCount** 	| int 	| 0 	| How many slides you wish to display. <br>If no value or 0 is set then the carousel will take up maximum width.<br>Overflow will be hidden.<br>Carousel `width` CSS property will be equal to the smallest value needed in order to display the desired slide count. 	|
| **minDisplayCount** 	| int 	| 0 	| Minimum number of slides to display.<br>If no value or 0 is set then no minimum width will be applied.<br>Overflow is **not** hidden.<br>Carousel `min-width` CSS property will be equal to the smallest value needed in order to display the desired slide count. 	|
| **gridGap** 	| number 	| 10 	| The gap between tiles in CSS pixels 	|
| **style** 	| React.CSSProperties 	| {} 	| Inline style used to overwrite the default Carousel container CSS 	|
| **slideContainerStyle** 	| React.CSSProperties 	| {} 	| Inline style used to overwrite the default `<div>` that wraps the slides (children) 	|
| **slideStyle** 	| React.CSSProperties 	| {} 	| Inline style used to overwrite the default `<div>` that wraps each slide (each child) 	|
| **showArrows** 	| boolean 	| true 	| Boolean to toggle displaying the prebuilt scroll arrows 	|
| **scrollSpeed** 	| number 	| 75 	| The maximum scroll speed allowed in pixels 	|
| **renderArrows** 	| ({isLeft,isRight,isHidden,scrollBy}) => React.Element 	|  	| Function that returns a React.Element to be used as the scroll arrows.<br>`isLeft` and `isRight` are booleans that define if it is the right or left scroll arrow.<br>`isHidden` defines if the arrows should be hidden (is true while scrollings/dragging and when you cannot scroll any more).<br>`scrollBy` should be called when the button is pressed and will scroll by the amount specified. 	|
| **children** 	| React.Node \| Array<React.Node> 	|  	| The slides you wish to display in the carousel 	|