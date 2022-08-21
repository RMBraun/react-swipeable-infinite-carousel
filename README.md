# react-swipeable-infinite-carousel

Simple swipeable, draggable, and scrollable React carousel component.
[A demo of the carousel can be seen here](https://rmbraun.github.io/react-swipeable-infinite-carousel/)


## Currently in progress:

- Infinite carousel
- custom styles
- custom arrows
- dynamic tile widths


## How to install:
```
npm install @rybr/react-swipeable-infinite-carousel

yarn add /react-swipeable-infinite-carousel
```

## How to use

```jsx
import { Carousel } from '@rybr/react-swipeable-infinite-carousel'

<Carousel
  startIndex={4} //which index to start on
  slideWidth={200} //width of each tile in px
  gridGap={15} //gap between each tile in px
  displayCount={4.5} //maximum number of tiles to display
  minDisplayCount={2.5} //minimum number of tiles to display
  showArrows={!isMobile} //toggles displaying the prebuilt scroll arrows
>
  {randomColors.map((color, i) => (
    <div key={i} style={tileCss}>
      {i + 1}
    </div>
  ))}
</Carousel>
```
