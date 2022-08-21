import React, { useEffect, useState, useMemo } from 'react'
import { Carousel } from './components/Carousel'

const HeaderCss: React.CSSProperties = {
  fontSize: '3rem',
}

const SectionTitleCss: React.CSSProperties = {
  fontSize: '2rem',
}

const TextCss: React.CSSProperties = {
  fontSize: '1.5rem',
}

const SectionContainerCss: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
}

const CarouselContainerCss: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  border: '5px solid gray',
  padding: '15px',
}

const TileCss = ({ color, width }: { color: string; width: string }): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '4rem',
  width: `${width}`,
  height: '300px',
  backgroundColor: `${color}`,
  borderRadius: '5px',
  color: 'white',
})

const getRandomColor = (): number => Math.floor(Math.random() * 205) + 10
const tileCache: Array<string> = []

function App() {
  const [isMobile, setIsMobile] = useState(false)
  const [tileCount, setTileCount] = useState(25)

  const randomColors = useMemo(() => {
    if (tileCount <= 0) {
      return []
    }

    const cachedTiles = tileCache.slice(0, tileCount)
    const newTileCount = tileCount - cachedTiles.length
    const newTiles =
      newTileCount <= 0
        ? []
        : Array(newTileCount)
            .fill(null)
            .map(() => `rgb(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`)

    if (newTiles.length > 0) {
      tileCache.push(...newTiles)
    }

    return [...cachedTiles, ...newTiles]
  }, [tileCount])

  useEffect(() => {
    const onResize = () => {
      if (document.body.clientWidth <= 475) {
        setIsMobile(true)
      } else if (document.body.clientWidth > 475) {
        setIsMobile(false)
      }
    }

    onResize()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      <h2 style={HeaderCss}>
        <u>react-swipeable-infinite-carousel Demo</u>
      </h2>
      <br />
      <p style={SectionTitleCss}>Swipeable, draggable, and scrollable carousel</p>
      <p style={TextCss}>Number of tiles (min: 0, max: 500): </p>
      <input
        style={TextCss}
        type={'number'}
        value={tileCount}
        onChange={(e) => setTileCount(Math.min(500, Math.max(0, parseInt(e.target.value || '0'))))}
      />
      <br />
      <div style={SectionContainerCss}>
        <div style={CarouselContainerCss}>
          <Carousel
            slideWidth={isMobile ? 80 : 200}
            gridGap={15}
            displayCount={isMobile ? 3 : 4}
            minDisplayCount={isMobile ? 1 : 2}
            showArrows={!isMobile}
          >
            {randomColors.map((color, i) => (
              <div
                key={i}
                style={TileCss({
                  color,
                  width: isMobile ? '80px' : '200px',
                })}
              >
                {i + 1}
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </>
  )
}

export default App
