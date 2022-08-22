import React, { useLayoutEffect, useState, useMemo } from 'react'
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
  alignItems: 'flex-start',
  border: '5px solid gray',
  padding: '15px',
  width: 'calc(100% - 30px)',
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
  const [displayCount, setDisplayCount] = useState('4')
  const [minDisplayCount, setMinDisplayCount] = useState('2')
  const [mobileDisplayCount, setMobileDisplayCount] = useState('4')
  const [mobileMinDisplayCount, setMobileMinDisplayCount] = useState('1')

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
            .fill(null)
            .map(() => `rgb(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`)

    if (newTiles.length > 0) {
      tileCache.push(...newTiles)
    }

    return [...cachedTiles, ...newTiles]
  }, [tileCount])

  useLayoutEffect(() => {
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

  const parsedDisplayCount = useMemo(() => {
    return Math.min(isMobile ? 4 : 5, Math.max(1, parseFloat(isMobile ? mobileDisplayCount : displayCount)))
  }, [isMobile, mobileDisplayCount, displayCount])

  const parsedMinDisplayCount = useMemo(() => {
    return Math.min(isMobile ? 3 : 5, Math.max(1, parseFloat(isMobile ? mobileMinDisplayCount : minDisplayCount)))
  }, [isMobile, mobileMinDisplayCount, minDisplayCount])

  return (
    <>
      <h2 style={HeaderCss}>
        <u>react-swipeable-infinite-carousel Demo</u>
      </h2>
      <br />
      <p style={SectionTitleCss}>Swipeable, draggable, and scrollable carousel</p>
      <label style={TextCss} htmlFor={'tileCount'}>
        Number of tiles (min: 0, max: 500):
      </label>
      <input
        name={'tileCount'}
        style={TextCss}
        type={'number'}
        value={tileCount}
        onChange={(e) => setTileCount(Math.min(500, Math.max(0, parseInt(e.target.value || '0'))))}
      />

      <br />
      <label style={TextCss} htmlFor={'displayCount'}>
        {`Display count (min: 1, max: ${isMobile ? 4 : 5}):`}
      </label>
      <input
        name={'displayCount'}
        style={TextCss}
        type={'text'}
        value={isMobile ? mobileDisplayCount : displayCount}
        onChange={(e) => {
          if (!isNaN(e.target.value as any)) {
            isMobile ? setMobileDisplayCount(e.target.value) : setDisplayCount(e.target.value)
          }
        }}
      />
      <br />
      <label style={TextCss} htmlFor={'minDisplayCount'}>
        {`Minimum display count (min: 1, max: ${isMobile ? 3 : 5}):`}
      </label>
      <input
        name={'minDisplayCount'}
        style={TextCss}
        type={'text'}
        value={isMobile ? mobileMinDisplayCount : minDisplayCount}
        onChange={(e) => {
          if (!isNaN(e.target.value as any)) {
            isMobile ? setMobileMinDisplayCount(e.target.value) : setMinDisplayCount(e.target.value)
          }
        }}
      />
      <br />
      <div style={SectionContainerCss}>
        <div style={CarouselContainerCss}>
          <Carousel
            slideWidth={isMobile ? 80 : 200}
            gridGap={15}
            displayCount={parsedDisplayCount}
            minDisplayCount={parsedMinDisplayCount}
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
