import { range } from 'lodash'
import React, { useCallback, useMemo } from 'react'
import { Carousel as CarouselEle } from '../components/Carousel'
import './Carousel.css'

const SectionContainerCss = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  height: '100%',
}

const CarouselContainerCss = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  border: '5px solid gray',
  padding: '15px',
  width: 'calc(100% - 30px)',
}

const TileCss = ({ color, width, height }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '4rem',
  width: `${width}`,
  height: `${height}`,
  backgroundColor: `${color}`,
  borderRadius: '5px',
  color: 'white',
})

const getRandomColor = () => Math.floor(Math.random() * 205) + 10
const getRandomWidth = () => Math.max(Math.min((Math.random() * 7 + 1) * 40 + 10, 300), 100)
const tileCache = []

const Template = ({
  isInfinite,
  randomTileSizes,
  showIndexes,
  indexesPerRow,
  startIndex,
  tileCount,
  displayCount,
  minDisplayCount,
  showArrows,
  slideWidth,
  slideHeight,
  gridGap,
  scrollable,
  draggable,
  hasDragMomentum,
  dragMomentumSpeed,
  dragMomentumDecay,
  CustomArrow,
}) => {
  const randomColors = useMemo(() => {
    if (!tileCount || tileCount <= 0) {
      return []
    }

    const cachedTiles = tileCache.slice(0, tileCount)
    const newTileCount = tileCount - cachedTiles.length
    const newTiles =
      newTileCount <= 0
        ? []
        : Array(newTileCount)
            .fill()
            .map(() => ({
              color: `rgb(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`,
              width: getRandomWidth(),
            }))

    if (newTiles.length > 0) {
      tileCache.push(...newTiles)
    }

    return [...cachedTiles, ...newTiles]
  }, [tileCount])

  return (
    <div style={SectionContainerCss}>
      <div style={CarouselContainerCss}>
        <CarouselEle
          isInfinite={isInfinite}
          startIndex={startIndex}
          gridGap={gridGap}
          displayCount={displayCount}
          minDisplayCount={minDisplayCount}
          showArrows={showArrows}
          showIndexes={showIndexes}
          indexesPerRow={indexesPerRow}
          renderArrows={CustomArrow}
          isScrollable={scrollable}
          isDraggable={draggable}
          hasDragMomentum={hasDragMomentum}
          dragMomentumSpeed={dragMomentumSpeed}
          dragMomentumDecay={dragMomentumDecay}
        >
          {randomColors.map(({ color, width }, i) => (
            <div
              key={i}
              style={TileCss({
                color,
                width: `${randomTileSizes ? width : slideWidth}px`,
                height: `${slideHeight}px`,
              })}
            >
              {i}
            </div>
          ))}
        </CarouselEle>
      </div>
    </div>
  )
}

export default {
  component: Template,
  title: 'Carousel',
  argTypes: {
    isInfinite: {
      control: { type: 'boolean' },
    },
    randomTileSizes: {
      control: false,
    },
    scrollable: {
      control: { type: 'boolean' },
    },
    draggable: {
      control: { type: 'boolean' },
    },
    hasDragMomentum: {
      control: { type: 'boolean' },
    },
    dragMomentumSpeed: {
      control: { type: 'range', min: 1, max: 50, steps: 1 },
    },
    dragMomentumDecay: {
      control: { type: 'range', min: 0.95, max: 0.99, step: 0.01 },
    },
    showIndexes: {
      control: { type: 'boolean' },
    },
    indexesPerRow: {
      control: { type: 'range', min: 0, max: 50, steps: 1 },
    },
    tileCount: {
      control: { type: 'range', min: 1, max: 50, step: 1 },
    },
    slideWidth: {
      control: { type: 'range', min: 1, max: 500, step: 1 },
      if: { arg: 'randomTileSizes', truthy: false },
    },
    slideHeight: {
      control: { type: 'range', min: 1, max: 500, step: 1 },
    },
    displayCount: {
      control: { type: 'range', min: 0, max: 50, step: 1 },
    },
    minDisplayCount: {
      control: { type: 'range', min: 0, max: 50, step: 1 },
    },
    startIndex: {
      control: { type: 'range', min: 0, max: 49, step: 1 },
    },
    gridGap: {
      control: { type: 'range', min: 1, max: 500, step: 1 },
    },
    showArrows: {
      control: { type: 'boolean' },
    },
  },
}

const carouselStoryArgs = {
  isInfinite: false,
  randomTileSizes: false,
  showIndexes: true,
  scrollable: true,
  draggable: true,
  hasDragMomentum: true,
  dragMomentumSpeed: 25,
  dragMomentumDecay: 0.98,
  showArrows: true,
  indexesPerRow: 0,
  tileCount: 25,
  slideWidth: 150,
  slideHeight: 250,
  displayCount: 4,
  minDisplayCount: 0,
  startIndex: 0,
  gridGap: 15,
}

export const DefaultCarousel = Template.bind({})
DefaultCarousel.args = carouselStoryArgs

export const VaryingSlideWidths = Template.bind({})
VaryingSlideWidths.args = {
  ...carouselStoryArgs,
  randomTileSizes: true,
}

export const InfiniteCarousel = Template.bind({})
InfiniteCarousel.args = {
  ...carouselStoryArgs,
  isInfinite: true,
}

export const CustomArrows = Template.bind({})
CustomArrows.args = {
  randomTileSizes: false,
  showIndexes: true,
  scrollable: true,
  draggable: true,
  hasDragMomentum: true,
  dragMomentumSpeed: 25,
  dragMomentumDecay: 0.98,
  showArrows: true,
  indexesPerRow: 0,
  tileCount: 25,
  slideWidth: 150,
  slideHeight: 250,
  displayCount: 4,
  minDisplayCount: 0,
  startIndex: 0,
  gridGap: 15,
  CustomArrow: ({ isLeft, isHidden, scrollBy }) => {
    const onClick = useCallback(
      (scrollCount) => (e) => {
        e.preventDefault()
        e.stopPropagation()

        scrollBy(scrollCount)
      },
      [scrollBy, isLeft],
    )

    return (
      <button
        className={`customArrow ${isHidden ? 'isArrowHidden' : ''} ${isLeft ? 'isLeftArrow' : ''}`}
        onClick={onClick(isLeft ? -1 : 1)}
      >
        <span className={`customArrowIcon ${isLeft ? 'isLeftArrowIcon' : 'isRightArrowIcon'}`} />
      </button>
    )
  },
}
