import React, { useMemo } from 'react'
import { Carousel as CarouselEle } from '../components/Carousel'
import { Arrows } from '../components/Arrows'
import { Indexes } from '../components/Indexes'
import './Carousel.css'

// import { Carousel as CarouselEle, Arrows, Indexes } from '../../dist/index.es'

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
  gridGap,
  scrollable,
  shouldScrollByDisplayCount,
  draggable,
  hasDragMomentum,
  dragMomentumSpeed,
  dragMomentumDecay,
  width,
  height,
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
          arrows={showArrows ? Arrows : null}
          indexes={showIndexes ? Indexes : null}
          indexesPerRow={indexesPerRow}
          isScrollable={scrollable}
          shouldScrollByDisplayCount={shouldScrollByDisplayCount}
          isDraggable={draggable}
          hasDragMomentum={hasDragMomentum}
          dragMomentumSpeed={dragMomentumSpeed}
          dragMomentumDecay={dragMomentumDecay}
        >
          {randomColors.map((slide, i) => (
            <div
              key={i}
              tabIndex={0}
              className={'tile'}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  console.log(`Tile ${i} clicked`)
                }
              }}
              style={TileCss({
                color: slide.color,
                width: `${randomTileSizes ? slide.width : width}px`,
                height: `${height}px`,
              })}
            >
              <button>{i}</button>
              <button>{i}</button>
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
      control: false,
      table: {
        disable: true,
      },
    },
    randomTileSizes: {
      control: false,
      table: {
        disable: true,
      },
    },
    width: {
      control: false,
      table: {
        disable: true,
      },
    },
    height: {
      control: false,
      table: {
        disable: true,
      },
    },
    scrollable: {
      control: { type: 'boolean' },
    },
    shouldScrollByDisplayCount: {
      control: { type: 'boolean' },
    },
    scrollCount: {
      control: { type: 'range', min: 1, max: 4 },
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
  width: '150',
  height: '250',
  isInfinite: false,
  randomTileSizes: false,
  showIndexes: true,
  showArrows: true,
  scrollable: true,
  shouldScrollByDisplayCount: true,
  scrollCount: 4,
  draggable: true,
  hasDragMomentum: true,
  dragMomentumSpeed: 25,
  dragMomentumDecay: 0.98,
  indexesPerRow: 0,
  tileCount: 25,
  displayCount: 4,
  minDisplayCount: 0,
  startIndex: 0,
  gridGap: 15,
}

export const Default = Template.bind({})
Default.args = carouselStoryArgs

export const DefaultVaryingWidths = Template.bind({})
DefaultVaryingWidths.args = {
  ...carouselStoryArgs,
  randomTileSizes: true,
  displayCount: 2,
}

export const Infinite = Template.bind({})
Infinite.args = {
  ...carouselStoryArgs,
  isInfinite: true,
  shouldScrollByDisplayCount: false,
  scrollCount: 1,
}

export const InfiniteVaryingWidth = Template.bind({})
InfiniteVaryingWidth.args = {
  ...carouselStoryArgs,
  isInfinite: true,
  shouldScrollByDisplayCount: false,
  scrollCount: 1,
  randomTileSizes: true,
  displayCount: 2,
}

export const MobileSingleItem = Template.bind({})
MobileSingleItem.args = {
  ...carouselStoryArgs,
  isInfinite: true,
  tileCount: 5,
  displayCount: 1,
  minDisplayCount: 1,
  width: '300',
  height: '500',
  hasDragMomentum: false,
  showArrows: false,
  scrollable: false,
}
