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
  height: '100%',
  backgroundColor: `${color}`,
  borderRadius: '5px',
  color: 'white',
})

const getRandomColor = () => Math.floor(Math.random() * 205) + 10
const tileCache = []

const Template = ({ startIndex, tileCount, displayCount, minDisplayCount, showArrows, slideWidth, gridGap }) => {
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
            .map(() => `rgb(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`)

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
          slideWidth={slideWidth}
          gridGap={gridGap}
          displayCount={displayCount}
          minDisplayCount={minDisplayCount}
          showArrows={showArrows}
          style={{
            height: '100%',
          }}
          slideContainerStyle={{
            height: '100%',
            width: '100%',
          }}
        >
          {randomColors.map((color, i) => (
            <div
              key={i}
              style={TileCss({
                color,
                width: `${slideWidth}px`,
              })}
            >
              {i + 1}
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
    tileCount: {
      control: { type: 'range', min: 1, max: 50, step: 1 },
    },
    startIndex: {
      control: { type: 'range', min: 0, max: 49, step: 1 },
    },
    slideWidth: {
      control: { type: 'range', min: 1, max: 500, step: 1 },
    },
    gridGap: {
      control: { type: 'range', min: 1, max: 500, step: 1 },
    },
    displayCount: {
      control: { type: 'range', min: 0, max: 50, step: 1 },
    },
    minDisplayCount: {
      control: { type: 'range', min: 0, max: 50, step: 1 },
    },
    showArrows: {
      control: { type: 'boolean' },
    },
  },
}

export const Carousel = Template.bind({})
Carousel.args = {
  tileCount: 25,
  startIndex: 0,
  slideWidth: 200,
  gridGap: 15,
  displayCount: 4,
  minDisplayCount: 2,
  showArrows: true,
}
