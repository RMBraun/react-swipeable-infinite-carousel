import React, { useMemo } from 'react'
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
  height: 'calc(100% - 30px)',
}

const TileCss = ({ color, width }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '4rem',
  width: `${width}`,
  height: '250px',
  backgroundColor: `${color}`,
  borderRadius: '5px',
  color: 'white',
})

const getRandomColor = () => Math.floor(Math.random() * 205) + 10
const getRandomWidth = () => Math.max(Math.min((Math.random() * 7 + 1) * 40 + 10, 300), 100)
const tileCache = []

const Template = ({
  randomTileSizes,
  startIndex,
  tileCount,
  displayCount,
  minDisplayCount,
  showArrows,
  slideWidth,
  gridGap,
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
          startIndex={startIndex}
          gridGap={gridGap}
          displayCount={displayCount}
          minDisplayCount={minDisplayCount}
          showArrows={showArrows}
        >
          {randomColors.map(({ color, width }, i) => (
            <div
              key={i}
              style={TileCss({
                color,
                width: `${randomTileSizes ? width : slideWidth}px`,
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
    randomTileSizes: {
      control: { type: 'boolean' },
    },
    tileCount: {
      control: { type: 'range', min: 1, max: 50, step: 1 },
    },
    slideWidth: {
      control: { type: 'range', min: 1, max: 500, step: 1 },
      if: { arg: 'randomTileSizes', truthy: false },
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

export const Carousel = Template.bind({})
Carousel.args = {
  randomTileSizes: false,
  tileCount: 25,
  slideWidth: 150,
  displayCount: 4,
  minDisplayCount: 0,
  startIndex: 0,
  gridGap: 15,
  showArrows: true,
}
